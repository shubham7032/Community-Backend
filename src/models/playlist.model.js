import mongoose, { Schema } from "mongoose";

const playListSchema = new Schema({
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    videos:[{
        type: Schema.Types.ObjectId,
        ref: "Video"
    }],
    name:{
        type: String,
        require: true
    },
    description:{
        type: String,
        require: true
    }
},{
    timestamps: true
})

export const PlayList = mongoose.model("PlayList",playListSchema)