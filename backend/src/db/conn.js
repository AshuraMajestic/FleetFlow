const mongoose = require('mongoose');
const URL = process.env.DATABASE_URL;

mongoose.set('strictQuery', false);

//  Creating a database
mongoose.connect(URL, {
}).then(() => {
    console.log("Connection Created");
}).catch((err) => {
    console.log("Error: " + err);
});