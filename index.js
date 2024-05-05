import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db=new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"World",
  password:"Papadurki2604",
  port:5432,
});
db.connect();



db.query("SELECT * FROM countries",(err,res)=>{
  if(err){
    console.log(err.stack);
  }else{

  }
})

let visitedCountries=[];
let lastId;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/",  async (req, res) => {
  visitedCountries = await db.query("SELECT * FROM visited_countries");
  lastId =  visitedCountries.rows[ visitedCountries.rows.length-1].id;
  console.log(lastId);
  const codes=[];

  visitedCountries.rows.forEach(x=> {
     codes.push(x.country_code)});

  res.render("index.ejs",{
    total:codes.length,
    countries:codes
  });
  console.log(codes);
});

app.post("/add",async (req,res)=>{
  try{
        
    //first way of making a query
    const firstQuery = await db.query("SELECT country_code FROM countries WHERE country_name = $1",  [req.body.country] );
    if(firstQuery.rows.length!==0){
      const countryCode=firstQuery.rows[0].country_code;

      //second way of making a query.
      const text= 'INSERT INTO visited_countries VALUES($1,$2)';
      const values=[lastId+1, countryCode];
      const secondQuery = await db.query(text,values);
    }
  
    res.redirect("/");
    
  }catch(error){
    console.log(error.stack);
  }


 
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
