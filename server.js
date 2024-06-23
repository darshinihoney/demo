let express = require('express');
let app = express();
let allroutes = require('./allroutes');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require("dotenv");

dotenv.config();
app.use(express.json());

app.use(cors({
    origin:"*",
    credentials: true
}));

app.options('*', cors(
    {
      origin: '*',
      credentials:true
    }
  ));

app.use((req,res,next) => {
    console.log(" Request received at " + (new Date()));
    next();
});

// connect
let db = async () => { 
    try{ 
        
        // console.log(process.env.DBURI);
        await mongoose.connect(process.env.DBURI);
        console.log(" connected to database");
    }
    catch(err) {
        console.log(' error connecting');
    }
}
db();



app.use('/',allroutes);

// connect to the database
// schema
// model
// from middleware, use model to get data from DB

app.listen(3001,()=>{ console.log("Backend server listening at port 3001")});
