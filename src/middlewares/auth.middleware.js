import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.util.js"
import { asyncHendler } from "../utils/AsyncHendler.util.js"
import jwt from "jsonwebtoken"

// added to check git commit

export const verifyJWT = asyncHendler(async(req,res,next)=>{
   
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
    if(!token) throw new ApiError (401, "Unauthrized request")

        const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        //console.log(decodeToken._id)
        const user = await User.findById(decodeToken?._id).select("-password -refreshToken")
        
        if(!user) throw new ApiError(401,"Invalid Token")

        req.user = user
        next()
}
catch(error){
    throw new ApiError(401, error?.message || "Invalid access token")
}
})
