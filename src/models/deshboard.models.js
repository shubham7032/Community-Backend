import mongoose, { Schema } from "mongoose";

const cards = Schema({
    name:{
        type: String,
        require: true
    },
    photo:{
        type: String,
        require: true
    },
    title:{
        type: String,
        require:true
    }
},{
    timestamps: true
})

export const Cards = mongoose.model("Cards", cards)