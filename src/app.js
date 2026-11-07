import express from "express"
import cookieParser from "cookie-parser"
// import cors from "cors"
import cors from "cors"

const app = express()
app.use (cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// router 
import router from "./routes/user.routes.js"
import CommentRouter from "./routes/comment.routes.js"
import healthcheckRouter from "./routes/healthcheck.routes.js"
import likeRouter from "./routes/like.routes.js"
import VideoRouter from "./routes/video.routes.js"

// routes decleration
app.use("/api/v1/users",router)
app.use("/api/v1/comments",CommentRouter)
app.use("/api/v1/healthCheck",healthcheckRouter)
app.use("/api/v1/like",likeRouter)
app.use("//api/v1/",VideoRouter)
export {app}