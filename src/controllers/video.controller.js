import { asyncHendler } from "../utils/AsyncHendler.util";
import { ApiError } from "../utils/ApiError.util";
import { ApiResponse } from "../utils/ApiResponse.util";

const getAllVideos =  asyncHendler((req,res)=>{
    
})

const publishVideos = asyncHendler((req,res)=>{

})

const getVideoById = asyncHendler((req,res)=>{

})

const deleteVideo = asyncHendler((req,res)=>{

})

const togglePublishStatus = asyncHendler((req,res)=>{

})

export {
    togglePublishStatus,
    publishVideos,
    deleteVideo,
    getAllVideos,
    getVideoById
}