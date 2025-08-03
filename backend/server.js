const express = require('express');
const cors= require('cors')
const userRouter= require('./routes/userRoute.js')
const taskRouter= require('./routes/taskRoute.js')
const app = express();
const connectDB = require('./config/db.js')

app.use(express.json());
app.use(cors());
connectDB();

app.use('/api/user',userRouter)
app.use('/api/tasks',taskRouter)

app.use('/',(req,res)=>{
    res.send('API Working')
})

app.listen(3000, () => console.log("Server running"));
