import mongoose, { Schema } from "mongoose";

const tweetSchema = new Schema({
    content:{
        type: String,
        require: true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{
    timestamps: true
})

export const Tweet = mongoose.Model("Tweet",tweetSchema)