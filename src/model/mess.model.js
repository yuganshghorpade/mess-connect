import mongoose from 'mongoose'

const plate = {
    price: Number,
    menu: [String],
    note: String
}

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
    menuModel:[
        {
            type: plate
        }
    ],
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
    location: {
        type: {
            type: String,
            enum: ['Point'], // GeoJSON type
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    }
},{
    timestamps:true
})

messSchema.index({ location: '2dsphere' });

messSchema.pre("save",async function (next) {
    
    if(!this.isModified("password")) return next();

    try {
        this.password = await bcrypt.hash(this.password,10)
        next()
    } catch (error) {
        return NextResponse.json(
            {
                status: 505,
                message: `An unexpected error occured while hashing the password. Error:-${error}`
            }
        )
    }
})

messSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password)
}

messSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        id:this._id,
        username:this.username,
        email:this.email,
        type:"mess"
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
}

messSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        id:this._id,
        username:this.username,
        type:"mess"
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}

const Mess = mongoose.models.Mess || mongoose.model('Mess', messSchema);

export default Mess;