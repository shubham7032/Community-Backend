//import { Schema } from "mongoose";
import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const videoSchema = new Schema({
    videoFile:{
        type:String,
        require:true
    },
    thumbnail:{
        type:String,
        require: true
    },
    tital:{
        type: String,
        reqiure: true
    },
    description:{
        type: String,
        reqiure: true
    },
    duration:{
        type:Number,
        require: true
    },
    views:{
        type: String,
        reqiure: true
    },
    isPublised:{
        type:Boolean,
        default: true
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},
{
    timestamps: true
}
)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)