import mongoose from "mongoose";
import Mess from "../model/mess.model.js";

const salesAnalysis = new mongoose.Schema({
    mess:{
        type: mongoose.Schema.Types.ObjectId,
        ref: Mess
    },
    sales:[{
        price : Number,
        name : String,
        quantity : {
            type: Number,
            default: 0
        },
        menu: String,
    }],
    note: String,
    date:{
        type: Date,
        default: Date.now
    }
},{
    timestamps:true
})

const SalesAnalysis = mongoose.models.SalesAnalysis || mongoose.model('SalesAnalysis', salesAnalysis);

export default SalesAnalysis;