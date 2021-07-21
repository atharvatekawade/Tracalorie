const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const ItemSchema = new Schema({
    _id: {
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    calories:{
        type:Number,
        required:true,
        default:0,
    },
    date:{
        type:String,
        required:true
    },
    month:{
        type:String,
        required:true
    }
});

module.exports=Item=mongoose.model('item',ItemSchema);