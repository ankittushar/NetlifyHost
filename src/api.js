const express = require("express");
const serverless = require("serverless-http");
const bodyParser=require('body-parser')

const app = express();
const router = express.Router();
const cors=require("cors");


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

router.get("/", (req, res) => {
  res.json({
    hello: "hi!"
  });
});


router.post("/evaluate",async(req,res)=>{
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
    


});


app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
