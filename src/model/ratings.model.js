import mongoose from 'mongoose'
import User from './user.model.js'
import Mess from './mess.model.js'

const ratingSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: User
    },
    mess:{
        type:mongoose.Schema.Types.ObjectId,
        ref: Mess
    },
    cleanliness:{
        type: Number,
        min:0,
        max:5
    },
    foodQuality:{
        type: Number,
        min:0,
        max:5
    },
    ownerBehaviour:{
        type: Number,
        min:0,
        max:5
    },
    deliveryPunctuality:{
        type: Number,
        min:0,
        max:5
    },
    variety:{
        type: Number,
        min:0,
        max:5
    },
    review:{
        type:String
    }
},{
    timestamps:true
})

const Rating = mongoose.models.Rating || mongoose.model('Rating', ratingSchema);

export default Rating;