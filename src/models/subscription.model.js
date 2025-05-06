import mongoose,{Schema} from "mongoose";
//import User from "./user.model"

const subscriptionSchema =new Schema({
    subscriber:{
        type: Object.Types.ObjectId,//one who is Subscribing
        ref: "User"
    },
    chennel:{
        type: Object.Types.ObjectId,//one to whom 'subscriber' is subscribing
        ref: "User"
    }
},{timestamps: true})

export const Subscription = mongoose.model("Subscription",subscriptionSchema)