//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/secretDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields: ['password']});

const User = mongoose.model("user", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {

  res.render("login");
});
app.post("/login", function(req, res) {
  const email = req.body.username;
  const password = req.body.password;

  User.findOne({
    email: email
  }, function(err, found) {
    if (!err) {
      if(found){
        if (found.password === password) {
          res.render("secrets");
        } else {
          res.send("password false, please try again");
        }
      } else{
        res.send("please register");
      }

    } else {
      console.log(err);
    }
  });
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  const email = req.body.username;
  const password = req.body.password;
  const user = new User({
    email: email,
    password: password
  });
  user.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.listen(3000, function() {
  console.log("server runs successfully on port 3000");
});
