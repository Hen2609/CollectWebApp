const mongoose = require("mongoose");
// maybe I will need to turn this off
// mongoose.set("strictQuery", false);
const user = process.env.MONGODB_USER
const password = process.env.MONGODB_PASSWORD
const port = process.env.MONGODB_LOCAL_PORT
const mongodb = process.env.MONGODB_DATABASE
const mongoDB = "mongodb://" + user + ":" + password + "@127.0.0.1:" + port;

console.log(mongoDB)

let db = undefined

async function main() {
    const db = await mongoose.connect(mongoDB,{dbName: mongodb})
    return db.connection
}   


/** 
 * @async
 * @function getDB
 * @returns {(mongoose.Connection|undefined)} The Mongoose connection if available, otherwise undefined.
 */
async function getDB(){
    if(db === undefined){
        db = await main().catch((err) => console.log(err));
    }
    return db
}

module.exports = getDB;