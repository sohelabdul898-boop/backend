import mongoose from "mongoose";
import { DB_Name } from "../constants.js";

const connectdb = async()=>{
    try {
        const conectioninstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_Name}`)
        console.log(`\n MongoDb connected !! DB host :${conectioninstance.connection.host}`)
        console.log(conectioninstance)
    } catch (error) {
        console.log("MongoDb error", error)
        throw err
        process.exit(1)

    }
}
export default connectdb