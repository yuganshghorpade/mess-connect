import mongoose from 'mongoose'

const messSchema = new mongoose.Schema({
    name:{
        type: String,
        minLength:5,
        trim:true,
        required: true
    },
    email:{
        type:String,
        required:true,  
        unique:true,
        lowercase:true,
        trim:true,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    },
    password:{
        type : String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    contactNo:{
        type: String,
        required: true
    },
    isPureVegetarian:{
        type: Boolean,
    },
    verificationStatus:{
        type: Boolean,
        default: false
    },
    openHours:{
        type: String
    },
    isDeliveryAvailable:{
        type: Boolean,
        default: false
    },
    deliveryHours:{
        type: String
    },
    refreshToken:{
        type:String
    },
    verifyCode:{
        type:String,
        match: /^[0-9]{6}$/
    },
    verifyCodeExpiry:{
        type:Date
    },
},{
    timestamps:true
})

export const Mess = mongoose.model('Mess',messSchema)