import mongoose from 'mongoose'

const dailymenuSchema = new mongoose.Schema({
    mess:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mess'
    },
    menu:{
        type: String
    }
},{
    timestamps:true
})


const Dailymenu = mongoose.models.Dailymenu || mongoose.model('Dailymenu', dailymenuSchema);

export default Dailymenu;