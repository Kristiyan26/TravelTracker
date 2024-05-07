import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db=new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"World",
  password:"HiddenPass",
  port:5432,
});
db.connect();



db.query("SELECT * FROM countries",(err,res)=>{
  if(err){
    console.log(err.stack);
  }else{

  }
})


let lastId;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function checkVisitedCountries(){
  const result =  await db.query("SELECT * FROM visited_countries");
  lastId =  result.rows[ result.rows.length-1].id;

  let visitedCountries=[];

  result.rows.forEach(x=> {
    visitedCountries.push(x.country_code)});
    
  return visitedCountries;
  
};

app.get("/",  async (req, res) => {
  const result = await checkVisitedCountries();
  res.render("index.ejs",{
    total:result.length,
    countries:result
  });

});

app.post("/add",async (req,res)=>{
 
  try{
        
    //first way of making a query
    const firstQuery = await db.query("SELECT country_code FROM countries WHERE LOWER(country_name) LIKE  '%' || $1 || '%' ;",  [req.body.country.toLowerCase()] );
 
    const countryCode=firstQuery.rows[0].country_code;

    try{
          //second way of making a query.
      const text= 'INSERT INTO visited_countries VALUES($1,$2)';
      const values=[lastId+1, countryCode];
      const secondQuery = await db.query(text,values);
       res.redirect("/");
    }
    catch(error){
      const result = await checkVisitedCountries();
      res.render("index.ejs",{
        total:result.length,
        countries:result,
        error: "Country has already been added."
      });

    }
    
  }catch(error){
    const result = await checkVisitedCountries();
    res.render("index.ejs",{
      total:result.length,
      countries:result,
      error: "Country does not exist.Try again!"
    });
  }


 
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
