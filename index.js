const express = require("express");
const youtube = require("youtube-api");
const fs = require("fs");
const multer = require("multer");
const cors = require("cors");
const uuid = require("uuid/v4");
const open = require("open");
//const mongoose = require("mongoose");
const credentials = require("./credentials.json");
const Q = require('q');
const bodyParser =  require ('body-parser');


const app = express();
const MongoClient = require('mongodb').MongoClient;
ObjectId = require('mongodb').ObjectId
const url = "mongodb://localhost:27017";

MongoClient.connect(url,  { useUnifiedTopology: true }, function(err, db) {
if (err) throw err;
const dbo = db.db("Youtube");

var storage = multer.diskStorage({
  destination: './',
  filename(req, file, cb){
      const newFileName = `${uuid()}-${file.originalname}`

      cb(null,newFileName);
  }
})

var  uploadVideoFile = multer({ storage }).single("videoFile");


app.use(express.json());
app.use(cors({ origin: 3000 }));

 const oAuth = youtube.authenticate({
  type: "oauth",
   client_id: credentials.web.client_id,
   client_secret: credentials.web.client_secret,
   redirect_url: credentials.web.redirect_uris[0]
 });


 app.post('/upload' , uploadVideoFile, (req, res)=> {
 
 const {title , description }= req.body

  return Q.try(() => {
    if(req.file) {
   return open(oAuth.generateAuthUrl({
         access_type: "offline",
         scope: "https://www.googleapis.com/auth/youtube.upload",
         state: JSON.stringify({ filename:req.file.filename, title, description, })
      }))
  };
  }).then((result) => {
    
  });
 })

 app.get('/oauth2callback' , (req, res) =>{
   res.redirect('http://localhost:3000/success');
   const { filename, title, description } =JSON.parse(req.query.state)
  
   oAuth.getToken(req.query.code, (err, tokens) => {
   
    if (err){

      return console.error(err);
    }
  oAuth.setCredentials(tokens);
  youtube.videos.insert({
    resource:{
      snippet:{ title, description},
      status: { privacyStatus: "public"}
    },
    part: "snippet,status",
    media:{
      body: fs.createReadStream(filename)
    }
  }, (err, data)=>{
    
     if(err){
       console.log(err);
       res.send(err);
     }
      var myobj = { 
        title: title, 
        description: description, 
        videoUrl: `https://www.youtube.com/watch?v=${data.id}`,
    
      };

      dbo.collection("Youtube_upload").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        //db.close();
      });
    });
    console.log("Done.")
   // process.exit()

  })
   })

   app.get('/api', function(req, res, next){

    dbo.collection("Youtube_upload").find({}).toArray( function(err, docs) {
      if(err) return next(err);
      console.log(docs)
      var response = {
        statusCode: 200,
        headers:  { 'Content-Type': 'application/json' },
        body:    JSON.stringify(docs)
      }
  res.send(response);
     
      });
    });
  });

  
     

const PORT = 9000;

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
