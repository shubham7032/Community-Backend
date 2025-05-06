import { asyncHendler } from "../utils/AsyncHendler.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { Cards } from "../models/deshboard.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";

const addCard = asyncHendler(async(req,res)=>{
    const {name,title} = req.body
    const imgLocalPath = req.file?.path

    if(!(name || title ||imgLocalPath)){
       throw new ApiError(400,"Not able add this card")
    }

    const Photo = await uploadOnCloudinary(imgLocalPath)

    if(!Photo){
        throw new ApiError(400,"photo upload failed")
    }

    const card = await Cards.create({
        name,
        photo: Photo.url,
        title
    })

    const newCard = await Cards.findById(card._id)

    if(!newCard){
        throw new ApiError(400,"Unable to upload Card")
    }
    
    return res.status(200)
        .json(new ApiResponse(200,newCard.photo,"Card added Successfully"))
})

const getAllCards = asyncHendler(async(req,res)=>{
    const card = await Cards.find()

    if(!card){
        ApiError(400,"Failed to fetch Cards")
    }
    
    return res.status(200)
    .json(new ApiResponse(200,{cards:card},"All cards Fetched Succesfully"))
})


const deleteCard = asyncHendler(async(req,res)=>{
    const id = req._id

    if(!id){
        throw new ApiError(404,"Failed to get id")
    }

    const card = await Cards.deteleOne(id)

    if(!card){
        throw new ApiError(404,"!Card not found")
     }

    return res.status(200)
    .json(new ApiResponse(200,card,"Delete Successfull"))
})


export {
    getAllCards,
    addCard,
    deleteCard
}