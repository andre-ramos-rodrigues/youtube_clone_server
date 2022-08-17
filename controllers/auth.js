import mongoose from 'mongoose'
import User from '../models/User.js'
import bcrypt from 'bcrypt'
import { createError } from "../error.js"
import jwt from 'jsonwebtoken'

export const signup = async(req,res,next) => {
  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(req.body.password, salt)
  try {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      image: req.body.image
    })
    const savedUser = await newUser.save()
    res.status(200).send(savedUser)
  } catch(err) {
    next(err)
  }
}

export const signin = async(req,res,next) => {
  try{
    const user = await User.findOne({name: req.body.name})
    if(!user) return next(createError(404, 'user not found'))
    const isCorrect = await bcrypt.compare(req.body.password, user.password)
    if(!isCorrect) return next(createError(400, 'wrong credentials'))
    const {password, ...others} = user._doc
    // generates a jwt token
    const token = jwt.sign({id: user._id}, process.env.JWT_KEY)
    // creates a cookie with the value of the jwt token
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  }catch(err){
    next(err)
  }
}

export const googleAuth = async(req,res,next) => {
  try{
    const user = await User.findOne({email: req.body.email})
    if(user){ // if the user already exists, sign in
      const token = jwt.sign({id: user._id}, process.env.JWT_KEY)
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(user._doc);
    }
    else{ // if not, create a new user
      const newUser = new User({
        ...req.body,
        fromGoogle:true
      })
      const savedUser = await newUser.save()
      const token = jwt.sign({id: savedUser._id}, process.env.JWT_KEY)
    res // and sign him in
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(savedUser._doc);
    }
  }catch(err){
    next(err)
  }
}