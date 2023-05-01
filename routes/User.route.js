const express = require('express')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { UserModel } = require('../models/User.model');

const userRouter = express.Router()

userRouter.post('/register', async(req, res)=>{
    const {name, email, gender, password, age, city} = req.body;

    const user1 = await UserModel.finOne({email});
    if(user1){
        res.status(400).send({msg:"User already exists"})
    }
    else{
        try {
            bcrypt.hash(password, 3, async(err, hash) =>{
                // Store hash in your password DB.
                if(err){
                    res.status(400).send(err.message)
                }
                else{
                    const newUser = new UserModel({name, email, gender, city, age, password:hash});
                    await newUser.save();
                    res.status(200).send({msg: "New user registered"})
                }
            });
        } catch (error) {
            res.status(400).send(error.message)
        }
    }
})


userRouter.post('/login', async(req, res)=>{
    const {email, password} = req.body;

    try {
        const user = await UserModel.findOne({email});
        if(user){
            bcrypt.compare(password, user.password, (err, result)=>{
                if(result){
                    const token = jwt.sign({userName:user.name, userId:user._id}, 'pass123');
                    res.status(200).send({msg: "Login Success", token: token})
                }
                else{
                    res.status(200).send({msg: "wrong credentials"})
                }
            })
        }
        else{
            res.status(200).send({msg: "wrong credentials"})  
        } 
    } catch (error) {
        res.status(400).send(error.message)
    }
    
})

module.exports = {
    userRouter
}