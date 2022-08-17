import Video from '../models/Video.js'
import User from '../models/User.js'
import {createError} from '../error.js'

export const addVideo = async (req,res,next) => {
  const newVideo = new Video({
    userId: req.user.id, ...req.body
  })
  try {
    const savedVideo = await newVideo.save()
    res.status(200).json('video uploaded successfully: ' + savedVideo)
  } catch(err){
    next(err)
  }
}

export const updateVideo = async (req,res,next) => {
try{
  const video = await Video.findById(req.params.id)
  if(!video) return next(createError(404, 'video not found'))
  if(req.user.id === video.userId){ // checks if the logged user's id is the same as the user that posted the video
    try{
      const updatedVideo = await Video.findByIdAndUpdate(req.params.id, {
        $set:req.body
      }, {new:true})
      res.status(200).json(updatedVideo)
    }catch(err){
      next(err)
    }
  }
}catch(err){
  next(err)
}
}

export const deleteVideo = async (req,res,next) => {
  try{ 
    const video = await Video.findById(req.params.id)
    if(!video) return next(createError(404, 'video not found'))
    if(req.user.id === video.userId){
      await Video.findByIdAndDelete(video.userId)
      res.status(200).json('video deleted')
    } else {
      return next(createError(403, 'you can only delete videos that you posted'))
    }
  }catch(err){
    next(err)
  }
}

export const getVideo = async (req,res,next) => {
  try{
    const video = await Video.findById(req.params.id)
    if(!video) return next(createError(404, 'video not found'))
    res.status(200).json(video)
  }catch(err){
    next(err)
  }
}

export const addView = async (req,res,next) => {
  try{
    await Video.findByIdAndUpdate(req.params.id, {
      $inc:{views: 1}
    })
    res.status(200).json('+1 view')
  }catch(err){
    next(err)
  }
}

export const random = async (req,res,next) => {
  try{
    const randomVideos = await Video.aggregate([{$sample:{size:8}}]) // gets 40 random videos
    res.status(200).json(randomVideos)
  }catch(err){
    next(err)
  }
}

export const trend = async (req,res,next) => {
  try{
    const videos = await Video.find().sort({views: -1}) // gets all the videos and returns the most viewed ones
    res.status(200).json(videos)
  }catch(err){
    next(err)
  }
}

export const sub = async (req,res,next) => {
  try{
   const user = await User.findById(req.user.id)
   const subs = user.subscribedUsers

   const list = await Promise.all(
    subs.map((channelId) => {
      return Video.find({ userId: channelId })
    })
   )
    res.status(200).json(list.flat().sort((a,b) => b.createdAt - a.createdAt))
  }catch(err){
    next(err)
  }
}

export const getByTag = async (req,res,next) => {
  const tags = req.query.tags.split(',')// gets the tags names in the query
  try{
    const videos = await Video.find({tags:{$in: tags}}).limit(20)// finds which videos matches the given tags
    res.status(200).json(videos)
  }catch(err){
    next(err)
  }
}

export const search = async (req,res,next) => {
  const query = req.query.q // gets the text in the query
  try{
    const videos = await Video.find({title: { $regex: query, $options: 'i'}}).limit(5) // find videos matching the title and the query
    res.status(200).json(videos)
  }catch(err){
    next(err)
  }
}