import { asyncHendler } from "../utils/AsyncHendler.util.js";
import {ApiError} from "../utils/ApiError.util.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.util.js"
import { ApiResponse } from "../utils/ApiResponse.util.js";
//import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const registerUser = asyncHendler( async (req,res) =>{
    const {fullName,email,userName,password} = req.body

    console.log(fullName,email,userName,password)


if(
    
  [fullName,email,userName,password].some((field) =>
    field?.trim() === "")){
        throw new ApiError(400 ,"All fields are required")
    }
    
   
    const existedUser = await User.findOne({
        $or: [{userName} , {email}]
    })
   
    if(existedUser){
        throw new ApiError(409, "User with username or email already exists") 
    }

   
    const avatarLocalPath =req.files?.avatar[0]?.path
    const coverImgLocalPath = req.files?.coverImage[0]?.path

   
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }
    
   
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage= await uploadOnCloudinary(coverImgLocalPath)

   
    if(!avatar){
        throw new ApiError(400,"Avatar file  iss required")
    }
    console.log(userName,email,fullName,password,avatar.url,coverImage.url)
    const user = await User.create({
        userName: userName.toLowerCase(),
        email,
        fullName,
        avatar: avatar.url,
        coverImage: coverImage.url,
        password,
    })

    const createUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
   
    if(!createUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createUser,"user register successfully")
    )
})

const generateAccessAndRefreshToken = async(userId)=>{
    try{
        const user = await User.findById(userId)
        const accessToken = user.genrateAccessToken()
        const refreshToken = user.genrateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken,refreshToken}

    }catch(error){
        throw new ApiError(500, "Somthing Went wrong while generating Access or refresh token")
    }
}

const loginUser = asyncHendler( async (req,res) =>{
    const {username,password,email} = req.body
    
    if(!username && !email) throw new ApiError(400,"username or email is required")
    
    const user = await User.findOne({
        $or: [{email},{username}]
    })

    if(!user) throw new ApiError(404,"User does not exist")

    const isPassword = await user.isPasswordCorrect(password) 

    if(!isPassword) throw new ApiError(400,"Invalid user Credentials")

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
    
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
 
    console.log(loggedInUser.coverImage,"m1")
    const options = {
        httpOnly: true,
        secure: true
    }
    
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
})

const logoutUser = asyncHendler(async(req, res) =>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    
    const options = {
        httpOnly : true,
        secure : true
    }
    
    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200 ,{},"User logged out"))
})

const refreshAccessToken = asyncHendler( async(req,res)=>{

    const RefreshToken = req.cookies.refreshToken 
   
    if(!RefreshToken){
        throw new ApiError (404,"Token has expied")
    }

    const decoedAccessToken = jwt.verify(RefreshToken,process.env.REFRESH_TOKEN_SECRET)
    //console.log(decoedAccessToken)
    const user = await User.findById(decoedAccessToken._id)

    if(!user){
        throw new ApiError(401,"Token is invalid")
    }

    console.log(decoedAccessToken._id)

    const {accessToken,refreshToken}= await  (decoedAccessToken._id)
   
    const options = {
        httpOnly: true,
        secure : true
    }

    return res.status(200)
    .cookie("AccessToken",accessToken,options)
    .cookie("RefreshToken",refreshToken,options)
    .json(new ApiResponse(200,{
        accessToken,refreshToken
    },"Token Succefully Refreshed"))
}) 

const changePassword = asyncHendler(async(req,res)=>{
    const {oldPassword, newPassword }= req.body

    const user = await User.findById(req.user?._id)
    isPasswordCurrect = await user.isPasswordCorrect(oldPassword)

       if(!isPasswordCorrect){
        throw new ApiError(400,"oldPassword Does not match")
    }

    user.password = newPassword
    await user.save({
        validateBeforeSave: false
    })

    return res.status(200)
    .json(new ApiResponse(200,{},"Password changed Successfully"))

}) 

const getCurrentUser = asyncHendler(async(req,res)=>{
    return res.status(200)
    .json(new ApiResponse(200,req.user,"Current User fetch Successfully"))
})

const updateUserAccount = asyncHendler(async(req,res)=>{
    const {email,fullName} = req.body

console.log(email,fullName)
    if(!(email || fullName)){
        throw new ApiError(400,"All fields are require")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,{
        $set:{
            fullName,
            email
        }
    },{
        new: true
    }).select("password")

    return res.status(200)
    .json(new ApiResponse(200,user,"User updated Successfully"))
})

const updateUserAvatar = asyncHendler(async(req,res)=>{
    const avatarFilePath = req.file?.path

    console.log(avatarFilePath)

    if(!avatarFilePath){
        throw new ApiError(400,"Avatar Image did not came")
    }

    const avatarUrl = await uploadOnCloudinary(avatarFilePath)

    if(!avatarUrl){
        throw new ApiError(400, "Unable to upload")
    }

    const user = User.findById(req.user?._id,{
        $set:{
            avatar:avatarUrl.url
        }
},{
    new: true
}).select("-password")

    return res.status(200)
            .json(new ApiResponse(200,user,"avatar is successfully updated"))

})

const updateUserCover = asyncHendler(async(req,res)=>{

        const coverFilePath = req.file?.path
    
        if(!coverFilePath){
            throw new ApiError(400,"Avatar Image did not came")
        }
    
        const coverUrl = await uploadOnCloudinary(coverFilePath)
    
        if(!coverUrl){
            throw new ApiError(400, "Unable to upload")
        }
    
        const user = User.findById(req.user?._id,{
            $set:{
                coverImage:coverUrl.url
            }
    },{
        new: true
    }).select("-password")
    
        return res.status(200)
                .json(new ApiResponse(200,user,"Cover is successfully updated"))
})

const getUserChennalProfile = asyncHendler(async(req,res)=>{
    const {username} = req.params
  
    if(!username){
        throw new ApiError(400,"Username is missing")
    }

    const chennal = await User.aggregate([
        {
                $match:{
                    username: username?.toLowerCase()
                }
        },
        {
            $lookup:{
                from: "subscriptions",
                localField: "_id",
                foreignField: "chennel",
                as: "subscribers"
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields:{
                subscriberCount:{
                    $size:"$subscribers"
                },
                chennalSubscribedToCount:{
                    $size:"$subscribedTo"
                },
                isSubscibed:{
                    $cond:{
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project:{
                fullName: 1,
                username: 1,
                subscriberCount: 1,
                chennalSubscribedToCount: 1,
                isSubscibed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ])


    if(!chennal?.length){
        throw new ApiError(404,"Chennal does not exist")
    }

    return res.status(200)
    .json(new ApiResponse(200, chennal[0],"User chennal fetched successfully"))
})

const getWatchHistroy = asyncHendler(async(req,res)=>{
    const user = await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },{
            $lookup:{
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistroy",
                pipeline:[
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [{
                                $project:{
                                    fullName: 1,
                                    username: 1,
                                    avatar : 1
                                }
                            }]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    
    ])

    return res.status(200)
    .json(new ApiResponse(200,user[0].watchHistroy,"watch histroy fetch succesfully"))
})

export {
    getWatchHistroy,
    getUserChennalProfile,
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    changePassword,
    updateUserAccount,
    updateUserCover,
    updateUserAvatar
}