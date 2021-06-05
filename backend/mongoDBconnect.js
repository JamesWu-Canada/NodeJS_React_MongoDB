 const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// dotenv.config()

const connection = {};
//const process.env.mongo_url = "mongodb+srv://jwu:Wumeister0303@cluster0.zpuhu.mongodb.net/painting?retryWrites=true&w=majority"
const dotenv = require('dotenv')
dotenv.config()

exports.mongoConnect = async () => {
    if (connection.isConnected) {
        console.log(`db was connected: ${process.env.mongo_url}`);
        return;
    }
    try {
        const db = await mongoose.connect(process.env.mongo_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        connection.isConnected = db.connections[0].readyState;
        console.log("mongoDB Connected : ", connection.isConnected);
        console.log(`db connected to : ${process.env.mongo_url}`);
    } catch (err){
        console.log ("db connection failed")
        console.log (err)
    }

    //connection.isConnected = db.connections[0].readyState;
    //console.log("mongoConnected : ", connection.isConnected);
}

//export default mongoConnect;