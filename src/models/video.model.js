import mongoose,{Schema} from 'mongoose'
import mongooseAggregatePaignate from "mongoose-aggregate-paginate-v2"

const videoSchema=new Schema(
    {
        videofile:{
            type:String,
            requires:true
        },
        thumbnail:{
            type:String,
            requires:true
        },
        title:{
            type:String,
            requires:true
    },
    description:{
            type:String,
            requires:true
},
duration:{
    type:Number,
    required: true
},
view:{
    type:Number,
    default:0
},
ispublished:{
    type:Boolean,
    default: true
},
owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
},


},
{
   timestamp:true 
}
)

videoSchema.plugin(mongooseAggregatePaignate)

export const video= mongoose.model("video",videoSchema)