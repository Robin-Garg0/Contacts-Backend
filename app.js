//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");

const port = process.env.PORT || 5000;
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  next();
});
mongoose.connect(process.env.MONGODB_LINK);

const contactSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String
});
const Contact = mongoose.model("contacts", contactSchema);

app.get("/", function(req, res){
    Contact.find({}).then((contacts) => {
        res.send(contacts);
    })
});

app.post("/", function(req, res){
    let phone = "+91" + req.body.phone, name="", email=req.body.email;
    _.words(req.body.name).map((word) => name=name.concat(" ",_.upperFirst(_.toLower(word))));
    name = _.trim(name);
    const contact = new Contact({
        name: name,
        phone: phone,
        email: req.body.email
    })
    contact.save().then();
});

app.patch("/:id", function(req, res){
    let phone = "+91" + req.body.phone, name="", email=req.body.email;
    _.words(req.body.name).map((word) => name=name.concat(" ",_.upperFirst(_.toLower(word))));
    name = _.trim(name);
    const id = req.params.id;
    Contact.updateOne({_id: id}, {name:name,phone:phone,email:email}).then();
});

app.delete("/:id", function(req, res){
    const id=req.params.id;
    Contact.findByIdAndDelete(id).then();
});

app.listen(port, function(){
    console.log("Server started on port " + port);
})