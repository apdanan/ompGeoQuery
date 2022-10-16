// app.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import * as geofirestore from 'geofirestore';
import express from 'express';
import bodyParser from 'body-parser';
const app = express();
// parse application/x-www-form-urlencoded
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json();
// parse application/json
app.use(bodyParser.json())


// Initialize the Firebase SDK
firebase.initializeApp({
  apiKey: "AIzaSyBbyWePOaGZL9eqyrD5KRZvsNI3kYfSOKQ",
  authDomain: "itbs-sca.firebaseapp.com",
  databaseURL: "https://itbs-sca.firebaseio.com",
  projectId: "itbs-sca",
  storageBucket: "itbs-sca.appspot.com",
  messagingSenderId: "1074308687279",
  appId: "1:1074308687279:web:ead459e231af778760fb5a"
});

// Create a Firestore reference
const firestore = firebase.firestore();

// Create a GeoFirestore reference
const GeoFirestore = geofirestore.initializeApp(firestore);

// Create a GeoCollection reference
const geocollection = GeoFirestore.collection('riders');


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/getriders', urlencodedParser, (req, res) => {
  var lat = parseFloat(req.body.lat);
  var lon = parseFloat(req.body.lon);
  var radius = parseInt(req.body.radius);
// Create a GeoQuery based on a location
  const query = geocollection.near({ center: new firebase.firestore.GeoPoint(lat, lon), radius: radius });

  // Get query (as Promise)
  let riders = Array();
  query.get().then((value) => {
    // All GeoDocument returned by GeoQuery, like the GeoDocument added above
    for (let index = 0; index < value.docs.length; ++index) {
      const element = value.docs[index];
      riders.push(element.id);
      // ...use `element`...
    }

    
    res.json({status:'passed',msg:'',riders:riders});
  });

  //res.json({status:'passed',msg:''});
});


app.post('/setrider',urlencodedParser, (req, res) => {
    var userid = req.body.userid;
    var lat = parseFloat(req.body.lat);
    var lon = parseFloat(req.body.lon);
    var datetime = Date();
    var ridername = req.body.name;
    // Add a GeoDocument to a GeoCollection
    geocollection.doc(userid).set({
      name: ridername,
      datetime:datetime,
      coordinates: new firebase.firestore.GeoPoint(lat,lon) //40.7589, -73.9851)
    });

    res.json({status:'passed',msg:''});
});



app.listen(3000, () => console.log('Server running on port 3000!'))
