const express  = require("express");

const app = express();




app.get("/", (req, resp)=>{
    resp.send("backend is running")
})




app.listen(9000,()=>{
    console.log("server is running on 9000 port")
})
