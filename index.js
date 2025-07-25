const express = require('express');
const path=require('path');
const cookieParser=require("cookie-parser");
const{connectToMongoDB}=require("./connect");
const{checkForAuthentication,restrictTo}=require("./middlewares/auth");
const URL=require('./models/url');
const UrlRoute=require('./routes/url');
const staticRouter=require('./routes/staticRouter');
const userRoute=require("./routes/user");
const app=express();
const PORT = 8001;
connectToMongoDB("mongodb://localhost:27017/short-url").then(()=>console.log('MongoDb connected'));
app.set("view engine","ejs");
app.set('views',path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthentication);
app.get("/test",async (req,res)=>{
  const allUrls=await URL.find({});
  return res.render('home',{
    urls:allUrls,
    name:'Piyush',
  });
})
app.use("/url",/*,restrictToLoggedinUserOnly,*/restrictTo(["NORMAL","ADMIN"]),UrlRoute);
app.use("/user",userRoute);

app.use("/", staticRouter);

app.get('/url/:shortId',async (req,res)=>{
  const shortId=req.params.shortId;
  const entry=await URL.findOneAndUpdate({
    shortId
  },{
    $push:{visitHistory:{
        timestamp:Date.now(),
    },

    },
});
res.redirect(entry.redirectURL);
})
app.listen(PORT,()=>console.log(`Server started at port at:${PORT}`));