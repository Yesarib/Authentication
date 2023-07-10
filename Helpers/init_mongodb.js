const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, 
{   
    useNewUrlParser: true,
    useUnifiedTopology:true,
    // useFindAndModify: false,
    // useCreateIndex: true,
})
.then(() => {
    console.log("mongodb connected");
})
.catch(err => console.log(err.message));


// mongoose.connect.on('connected', () => {
//     console.log("Mongoose coonntected to db");
// })

// mongoose.connect.on('error', (err) => {
//     console.log(err.message);
// })

// mongoose.connect.on('disconnected', () => {
//     console.log("Mongoose connection is disconnected");
// })