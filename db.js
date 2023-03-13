const mongoose=require('mongoose');

const connection=mongoose.connect(process.env.mongoURL);

mondule.exports={
    connection
}