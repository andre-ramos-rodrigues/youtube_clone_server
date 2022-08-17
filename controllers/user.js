import mongoose from 'mongoose'
import User from '../models/User.js'
import Video from '../models/Video.js'
import {createError} from '../error.js'

export const update = async(req,res,next) => {
  if(req.params.id === req.user.id){
    try{
      const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      }, {new:true}) // new:true shows the updated field in postman/insomnia
      res.status(200).json(updatedUser)
    }catch(err){
      return next(createError(404, 'could not find user'))
    }
  }else{
    return next(createError(403, 'you can only update your own account'))
  }
}

export const del = async(req,res,next) => {
  if(req.params.id === req.user.id){
    try{
      await User.findByIdAndDelete(req.params.id)
      res.status(200).json('user deleted')
    }catch(err){
      return next(createError(404, 'could not find user'))
    }
  }else{
    return next(createError(403, 'you can only delete your own account'))
  }
}

export const getUser = async(req,res,next) => {
    try{
      const user = await User.findById(req.params.id)
      res.status(200).json(user)
    }catch(err){
      return next(createError(404, 'could not find user'))
    }
}

export const subscribe = async(req,res,next) => {
    try{
      await User.findByIdAndUpdate(req.user.id, {  //get the id of the logged user
        $push:{subscribedUsers:req.params.id} //in the logged user, add the channel id to the subscribed list
      })
      await User.findByIdAndUpdate(req.params.id, { //get the id of the channel that is being subscribed by the user
        $inc:{subscribers: 1} //in the channel onwer id, add +1 in the subscribers count
      })
      res.status(200).json('subscription successfull')
    }catch(err){
      return next(createError(404, 'could not find user'))
    }
}

export const unsubscribe = async(req,res,next) => {
    try{
      await User.findByIdAndUpdate(req.user.id, {  //get the id of the logged user
        $pull:{subscribedUsers:req.params.id} //in the logged user, remove the channel id to the subscribed list
      })
      await User.findByIdAndUpdate(req.params.id, { //get the id of the channel that is being unsubscribed by the user
        $inc:{subscribers: -1} //in the channel onwer id, subscribe -1 in the subscribers count
      })
      res.status(200).json('unsubscription successfull')
    }catch(err){
      return next(createError(404, 'could not find user'))
    }
}

export const like = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  try {
    await Video.findByIdAndUpdate(videoId,{
      $addToSet:{likes:id}, // push the user id in the likes array without duplicating
      $pull:{dislikes:id} // remove the user id from the dislikes array (if its there)
    })
    res.status(200).json("The video has been liked.")
  } catch (err) {
    next(err);
  }
};
export const dislike = async(req,res,next) => {
  const id = req.user.id
  const videoId = req.params.videoId
  try{
    await Video.findByIdAndUpdate(videoId, {
      $addToSet:{dislikes:id}, // push the user id in the dislikes array without duplicating
      $pull:{likes:id} // remove the user id from the likes array (if its there)
    })
    res.status(200).json('video disliked')
  }catch(err){
    return next(createError(404, 'could not find the video'))
  }
}