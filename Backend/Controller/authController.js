import userSchema from "../models/auth.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


console.log("secretkey", process.env.secret_key);

export const Signup = async(req, res) => {
try{
   console.log("sighup ");
   const { name, email, password } = req.body;
   console.log("Received data:", { name, email, password });

   if(!name || !email || !password){
    return res.status(400).json({"message": "All fields are required"});
   }
   const userExists = await userSchema.findOne({ email});
   if(userExists){
    return res.status(400).json({"message": "User already exists"});


   }

   const hashedpassword = await bcrypt.hash(password, 10);
   const user = await userSchema.create({
    name,
    email,
    password: hashedpassword
   })

   const userToReturn = {
    name: user.name,
    email: user.email,
    password: user.password
   }
    res.status(201).json({"message" : "User created sucessfully", user: userToReturn});

    


} catch(error){
  console.error("Error in signup controller:", error);
  res.status(500).json({"message": "Internal server error"});


}
    

 }

 export const Login = async(req ,res) =>{
  try{
    const {email , password } = req.body;
    console.log("data recived" ,email , password);

    if(!email || password){
           return res.status(400).json({"message": "All fields are required"});
    }
    const user = user.findOne({email}).select("+password");
    if(!user){
      return res.status(400).json({"message": " User doesn't exists"});

    }
    const match  = await bcrypt.compare(password , user.password);
    if(!match){
      return res.status(400).json({"message":"invalid credentials"});

    }

    const payload = {
      user = user._id,
      email = user.email,
      password = user.password


    }

    const token = jwt.sign(payload , process.env.secret_key{
      expiresIn : "7d"
    });

  
    
    res.status(201).json({"message" : "User Login sucessfully", token});
  } catch(error){
  console.error("Error in signup controller:", error);
  res.status(500).json({"message": "Internal server error"});


}
 }