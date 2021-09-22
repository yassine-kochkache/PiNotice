const mongoose = require("mongoose");

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose
    .connect("mongodb://localhost:27017/mydatabase", options)
    .then((success) => {
        console.log("=> Database connected successfully!");
    })
    .catch((error) => {
        console.log(error);
        console.log("=> Database connected with errors!");
    });