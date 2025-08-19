const express  = require("express");

require("dotenv").config();

const app = express();

const port = process.env.PORT;





app.get("/", (req, resp)=>{
    resp.send("backend is running")
})




app.listen(9000,()=>{
    console.log(`server is running on ${port}` )
})
