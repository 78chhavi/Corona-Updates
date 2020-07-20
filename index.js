const fs=require("fs");
const express=require("express");
const request=require("request");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");

app=express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


mongoose.connect("mongodb+srv://admin-chhavi:sweety123@cluster0.orf20.mongodb.net/coronasdB",{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const coronaSchema=new mongoose.Schema({
  fname:String,
  lname:String,
  email:String,
  contact:Number,
  message:String
});

const Corona=mongoose.model("Corona",coronaSchema);




app.get("/",(req,res)=>{
  request("https://api.covid19api.com/summary", function (err, response, body) {
    if(err!=null)
      console.error('error:', err);
  console.log('statusCode:',response.statusCode);
  obj=JSON.parse(response.body).Countries;
  res.render("home",{worldData:obj});
});
});


app.get("/india",(req,res)=>{
  request("https://api.covid19india.org/data.json", function (err, response, body) {
    if(err!=null)
      console.error('error:', err);
  console.log('statusCode:',response.statusCode);
  obj=JSON.parse(response.body).statewise;
  console.log(obj);
  res.render("india",{indiaData:obj});
});
});


app.get("/regionwise",(req,res)=>{
  request("https://api.covid19india.org/state_district_wise.json", function (err, response, body) {
    if(err!=null)
      console.error('error:', err);
  console.log('statusCode:',response.statusCode);
  obj=JSON.parse(response.body);
  res.render("regionwise",{regionsData:obj});
});
});

app.post("/",(req,res)=>{
  const details=req.body;
  const newPerson=new Corona({
    fname:details.fname,
    lname:details.lname,
    email:details.email,
    contact:details.contact,
    message:details.message
  });
  newPerson.save(function(err){
    if(err)
      return handleError(err);
    console.log("Successfully Inserted");
  });
  res.redirect('/');
});

let port=process.env.PORT;
if(port==null||port=="")
{
  port=8000;
}
app.listen(port,function(){
  console.log("Server started successfully");
});
