const express = require('express');
const app = express();

let cookieParser=require('cookie-parser')
app.use(cookieParser())

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://Bhagaban:L2vSe5ZRZjoVfhOA@cluster0.ojbuh.mongodb.net/searchingyard",{
    useNewUrlParser: true,
})
.then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log(err);
})

const sessions = require('express-session');

const oneDay = 1000 * 60 * 60 * 24;//24h

app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));


const route = require('./routes/routes');
app.use('/', route);

app.listen(process.env.PORT || 3000, function () {
    console.log(`Server Connected at port ${process.env.PORT || 3000}`)
});