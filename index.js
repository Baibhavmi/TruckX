const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

 
var foodItem = require('./foodItem')
var orders = require('./order')
var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");
require('dotenv').config()

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
firebase.initializeApp(firebaseConfig);

const port = process.env.PORT || 5500;
let db =firebase.default.firestore();

app.use(cors());
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Working at port ${port}`);
});

app.use('/foodItem', foodItem)
app.use('/order', orders)

app.post("/userExist" ,async (req, res,next) => {
  
  if(req.body.userName){
    db.collection('users').where('userName','==',req.body.userName).get()
    .then(data=>{
      res.status(200).send({"status":"err","message":"user Exist"});
    })
    .catch(err=>{
      res.send({"status":"success","message":"user Not Exists"});
    })
  }
  else{
    res.status(406).send({"status":"error","error":"User Name missing"});
  }
});

app.post("/signUp" ,async (req, res,next) => {
  
  if(req.body.userName && req.body.password){
    var password=await bcrypt.hash(req.body.password, 10);
    user={
      "userName": req.body.userName,
      "password": password
    }
    db.collection('users').where('userName','==',req.body.userName).get()
    .then(data=>{
      res.status(200).send({"status":"err","message":"user Exist"});
    })
    .catch(err=>{
      db.collection('users').add(user)
      .then(succ=>{
        let token = jwt.sign({
          user:succ.id,
          name: req.body.userName, 
          status:"Authenticated",
          issueTime: Date.now(),
          expiryTime: Date.now()+900000
        }, process.env.accessToken);
        res.status(200).send({"status":"success","success":"Authenticated",accessToken:token});
        // res.status(201).send({"status":"success","message":"User created"});
      })
      .catch(err=>{
        res.send({"status":"error","error":err});
      });
    });
  }
  else{
    if(!req.body.userName){
      if(!req.body.password)
        res.status(406).send({"status":"error","error":"User Name and Password missing"});
      else
        res.status(406).send({"status":"error","error":"User Name missing"});
    }else{
      if(!req.body.password)
        res.status(406).send({"status":"error","error":"Password missing"});
    }
  }
});

app.post("/login" ,async (req, res, next) => {
	if(req.body.userName && req.body.password){
		db.collection('users').where('userName','==',req.body.userName).get()
		.then(data=>{
			if(data.size==0){
				res.status(404).send({"status":"error","error":"User not found"})
			}else
		 	data.forEach(async doc => {
				if(await bcrypt.compare(req.body.password, doc.data().password)){
          console.log(Date.now())
          let token = jwt.sign({
            user:doc.id,
            name: doc.data().userName, 
            status:"Authenticated",
            issueTime: Date.now(),
            expiryTime: Date.now()+900000
          }, process.env.accessToken);
          res.status(200).send({"status":"success","success":"Authenticated",accessToken:token});
        }
				else
					res.status(401).send({"status":"error","error":"Password incorrect"});
			});
		})
		.catch(err=>{
			res.status(400).send({"status":"error","error":err});
		})
	}
	else{
    if(!req.body.userName){
      if(!req.body.password)
        res.status(406).send({"status":"error","error":"User Name and Password missing"});
      else
        res.status(406).send({"status":"error","error":"User Name missing"});
    }else{
      if(!req.body.password)
        res.status(406).send({"status":"error","error":"Password missing"});
    }
  }
});

