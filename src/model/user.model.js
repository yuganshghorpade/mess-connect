import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        minLength:2,
        maxLength:20,
        trim:true,
        match:/^(?=.*[a-z])[a-z0-9_]+$/

    },
    email:{
        type:String,
        required:true,  
        unique:true,
        lowercase:true,
        trim:true,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    },
    fullName:{
        type:String
    },
    contactNo:{
        type:String,
        required:true
    },
    address:{
        type:String
    },
    password:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    verifyCode:{
        type:String,
        match: /^[0-9]{6}$/
    },
    verifyCodeExpiry:{
        type:Date
    },
    isPureVegetarian:{
        type:Boolean
    }
},
{
    timestamps:true
})

userSchema.pre("save",async function (next) {
    
    if(!this.isModified("password")) return next();

    try {
       this.password = await bcrypt.hash(this.password,10);
        next();
    } catch (error) {
        next(error)
    }
});

userSchema.methods.isPasswordCorrect = async function (password) {
    console.log(this.password);
    console.log(password);
    const passwordcorrectness =  await bcrypt.compare(password,this.password)
    console.log(passwordcorrectness)
    return passwordcorrectness
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        id:this._id,
        username:this.username,
        email:this.email,
        type:"user"
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        id:this._id,
        username:this.username,
        type:"user"
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}



const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;