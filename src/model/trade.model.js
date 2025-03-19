import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    mess:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mess'
    },
    trader:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    mealtype:{
        type: String
    },
    status:{
        type: String,
        default: "Pending"
    },
    amount:{
        type: Number,
        required:true
    }
},{
    timestamps:true
})

const Trade = mongoose.models.Trade || mongoose.model('Trade', tradeSchema);

export default Trade;
