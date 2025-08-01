const mongoose= require ("mongoose")

const taskschema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        default:''
    },
    priority:{
        type:String,
        enum:['low','medium','high'],
        default:'low',
    },
    dueDate:{
        type:Date
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,ref:'User',required:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    createdAt:{
       type:Date,
       default:Date.now 
    }
})

module.exports= new mongoose.model("Task",taskschema)