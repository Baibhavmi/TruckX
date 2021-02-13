const express = require("express");
const router = express.Router();
const cors = require("cors");
const bodyParser = require("body-parser");

var firebase = require("firebase/app");

require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyCtq47o8DMDNpYw1n79KYCfneSAyfTbFuI",
    authDomain: "food-274de.firebaseapp.com",
    databaseURL: "https://food-274de.firebaseio.com",
    projectId: "food-274de",
    storageBucket: "food-274de.appspot.com",
    messagingSenderId: "140966870896",
    appId: "1:140966870896:web:297fb7ccc6551cb15699b5",
    measurementId: "G-CM2G27GSB3"
  };
var otherApp = firebase.initializeApp(firebaseConfig, "other");
let db =otherApp.firestore();


router.use(cors())
router.use(bodyParser.json())


router.get('/getAllAlarm',  (req, res)=> {
	db.collection("alarm")
    .get()
	.then(data=>{
		var arr=[];
		data.forEach(ele => {
			arr.push(ele.data());
		});
		return arr
	})
	.then(arr=>{
		if(arr.length)
		res.status(201).send({"status":"success","data":arr, "token":req.token});
		else
		res.status(201).send({"status":"error","error":"No food item available"})
		
	})
	.catch(err=>{
		res.status(401).send({"status":"error","error":"err.body.message"});
	})
})

module.exports = router