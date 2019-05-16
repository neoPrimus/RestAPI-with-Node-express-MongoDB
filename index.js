const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config")


const app = express();
app.set('port', process.env.PORT || 4500)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const postRoutes = require("./routes/posts");
app.use('/post', postRoutes);

mongoose.connect( process.env.Database_Connection,
{ useNewUrlParser: true },()=>{
    console.log("db is connected")
})

app.get('/', (req,res) => {
    res.send("Hey Buddy")
})

app.listen(app.get('port'),()=>{
    console.log("app is running on port " + app.get('port'));
})