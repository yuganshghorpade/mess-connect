import mongoose from "mongoose";

let connections = {};

const dbConnect = async()=>{
   if (connections?.isConnected) {
        console.log("Already connected to the database");
        return;
   }
    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_URI}/MessConnect`);
        connections.isConnected = connection.connections[0].readyState;
        console.log("Database connected successfully")
    } catch (error) {
        console.error(`Error occured while connecting to database. Error:-${error}`)
    }
}
export default dbConnect;