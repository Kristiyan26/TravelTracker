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



let countries=[];
let lastId;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/",  async (req, res) => {
  countries = await db.query("SELECT * FROM visited_countries");
  lastId = countries.rows[countries.rows.length-1].id;
  const codes=[];

  countries.rows.forEach(x=> {
     codes.push(x.country_code)});

  res.render("index.ejs",{
    total:codes.length,
    countries:codes
  });
  console.log(codes);
});

app.post("/add",async (req,res)=>{
  try{
     const countryCode = req.body.country;
     const text = 'INSERT INTO visited_countries VALUES($1,$2)';
     const values=[lastId+1, countryCode];
     const result =  await db.query(text,values);
     
    res.redirect("/");
  }catch(error){6
    console.log(error);
  }


 
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
