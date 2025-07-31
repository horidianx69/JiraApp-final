const mongoose= require('mongoose')

const connectDB= async()=>{
    await mongoose.connect("mongodb+srv://ayushshuklaps:Ayush.Shukla123!%40%23@cluster0.cn79tbq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>(console.log('DB connected'))).catch((err)=>(console.log('Cannot connect to DB',err)))
}

module.exports=connectDB;