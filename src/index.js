
import { app } from "./app.js";
import connectdb from "./db/db.js";
import dotenv from "dotenv"

dotenv.config({
    path:"./env"
})

connectdb()

.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is Running In the Port:${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("MONGO DB CONECTION FAILED!!!",err)
})





// import express from "express"
// const app = express()







// using ife we can connect the database it is a profesional approach
/*
(async ()=>{
try {
     await mongoose.connect(`${process.env.MONGODB_URL}/${DB_Name}`)
     app.on("error",()=>{
        console.log("ERROR:",error)
        throw error
     })
     app.listen(process.env.PORT,()=>{
        console.log(`app is listenig on port ${process.env.PORT}`)
     })

} catch (error) {
    console.log("ERROR:",error)
    throw error
}
})
*/