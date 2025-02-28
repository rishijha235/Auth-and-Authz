const express = require('express');
const app = express();

require('dotenv').config();
const PORT = process.env.PORT;

//import cookie parser middleware 
const cookieParser = require('cookie-parser');
app.use(cookieParser());


app.use(express.json());

require("./config/database").connect();

//route import and mount
const user = require('./routes/user');
app.use('/api/v1', user);

app.get("/praveer", (req, res) => {
    res.send("Love from Riya!");
})
//activate server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

//message will display on homepage
app.get('/', (req, res) => {
    res.send("<h1>Welcome to the homepage</h1>");
})