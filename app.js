const express=require('express');
const mongoose=require("mongoose");
const Example=require("./models/Example")
const cors=require("cors")
const app=express();

const bodyParser=require('body-parser')

require('dotenv').config();

mongoose.connect(process.env.MONGO_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
    }
  ).then(console.log("connected t mongo"))
  .catch(err=>console.log(err));


 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(bodyParser.json());

 app.use(cors());

// app.post("/", async(req,res)=>{
//     const newExample = new Example(req.body);
//   try {
//     const saved = await newExample.save();
    
//     res.status(200).json(saved);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// })

// app.use('/',(req,res,next)=>{
//     console.log("working")
//     next();
// })


// main entrypoint
app.post("/evaluate",async(req,res)=>{
    // const db= await Example.findOne();
    
    const db={
        "A":1,
        "B":3,
        "C":5,
        "D":6,
        "E":9
    }
    
    let expression=req.body.expression;
    
    let comparator=req.body.comparator;
    let rhs=req.body.rhs
    let value;
    
    expression.map((e,index)=>{
        if((/[A-Z]/).test(e)){
            expression[index]="db."+e;
        }

    })

    expression=expression.join("");
   
    try{
        value=eval(expression);
        // console.log(` value:${value}`)

    }catch(err){
        res.send("invalid expression")
        return
    }

    if(comparator==""){
       
        res.send(`${value}`)
    }
    else if( eval(value+comparator+rhs)){
        res.send("true")
    }
    else{
        res.send("false")
    }
    


})


module.exports=app;
