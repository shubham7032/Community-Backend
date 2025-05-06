import { asyncHendler } from "../utils/AsyncHendler.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { Comments } from "../models/comments.model.js";

const getAllComment = asyncHendler(async(req,res)=>{
    const comment = await Comments()
    
})

const addComment = asyncHendler((req,res)=>{

})

const deleteComment = asyncHendler((req,res)=>{

})


export {
    getAllComment,
    addComment,
    deleteComment
}
