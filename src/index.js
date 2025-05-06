import dotenv from "dotenv"
import connectDB from "./db/index.js"
import {app} from "./app.js"

dotenv.config()

connectDB()
.then(() =>{
    app.listen(process.dotenv.PORT || 8000, () =>{
        console.log(`Server is listing on port: ${process.dotenv.PORT}`);

    })
})
.catch((err) =>{
    console.log("Mondo bd connection failed !!!", err);
})



