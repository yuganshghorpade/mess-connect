import mongoose from 'mongoose'
import { User } from './user.model.js'
import { Mess } from './mess.model.js'

const subscriptionSchema = new mongoose.Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref: User
    },
    mess:{
        type : mongoose.Schema.Types.ObjectId,
        ref: Mess
    },
    startDate:{
        type: Date
    },
    expiry:{
        type: Date
    },
    status:{
        type:String,
        enum:['Active','Expired'],
        default:'Active'
    },
    
},{
    timestamps:true
})

export const Subscription = mongoose.model('Subscription',subscriptionSchema)