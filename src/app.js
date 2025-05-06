import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
    origin: "*",
    Credential: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"))
app.use(cookieParser());


//Routes import

import userRouter from "./routes/user.routes.js"
import commentRouter from "./routes/comment.routes.js"
import deshboardRouter from "./routes/deshboard.routes.js"
import likeRouter from "./routes/like.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import videoRouter from "./routes/video.routes.js"
import subscriberRoutes from "./routes/subscriber.routes.js"
import playlistRoutes from "./routes/playlist.routes.js"

//Routes Declaration

app.use("/api/v1/user",userRouter)
app.use("/api/v1/comment", commentRouter)
app.use("/api/v1/deshboard", deshboardRouter)
app.use("/api/v1/like", likeRouter)
app.use("/api/v1/tweet", tweetRouter)
app.use("/api/v1/video", videoRouter)
app.use("/api/v1/subscriber", subscriberRoutes)
app.use("/api/v1/playlist", playlistRoutes)


export { app }

