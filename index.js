const express=require('express');
const {connection}=require('./db');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const app=express();
app.use(express.json());


//userSChema

const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:String
})

userSchema.methods.validPassword=function(password){
    return bcrypt.compareSync(password,this.password)
}

const USer=mongoose.model("User",userSchema);

// productSChema

const productSchema=new mongoose.Schema({
    name:String,
    description:String,
    price:Number
})

const Product=mongoose.model("Product",productSchema);


//signup
app.post('/signup',async(req,res)=>{
    try{
        const {name,email,password,role}=req.body
        const alreadyUSer=await USer.findOne({email});
        if(alreadyUSer){
            return res.status(400).json({error:'User already exists'})
        }

        const hashPassword=bcrypt.hashSync(password,6);
        const user=new User({name,email,password:hashPassword,role});
        await user.save();
        res.send("User created successfully")
    }
    catch(err){
        res.send(err.message);
    }
})


//login
app.post('/login',async(req,res)=>{
    try{
        const {email,password}=req.body
        const user=await User.findOne({email});
        if(!user|| !user.validPassword(pass)){
            res.send("Invalid email or password")
        }
        const token=jwt.sign({id:user._id,role:user.role});
        const refreshToken=jwt.sign({id:user._id,role:user.role},process.env.secret,{expiresIn:'5m'});
        refreshToken.send({token,refreshToken});
    }
    catch(err){
        res.send(err.message)
    }
})

// logout

app.post('/logout',async(req,res)=>{
    try{
        const {token}=req.body;
        await User.updateOne({_id:req.user.id},{$pull:{refreshToken:token}});
        res.send("Logout success")
    }
    catch(err){
        res.send(err);
    }
})





app.listen(6000,async()=>{
    try{
await connection
console.log("Connected and listening to 6000");
    }
    catch(err){
console.log(err);
    }
})