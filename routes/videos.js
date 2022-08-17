import express from 'express'
import { addVideo, getVideo, deleteVideo, updateVideo, addView, sub, trend, random, search, getByTag } from '../controllers/video.js'
import {verifyToken} from '../utils/verifyToken.js'
const router = express.Router()

//ADD
router.post('/', verifyToken, addVideo)
//UPDATE
router.put('/:id', verifyToken, updateVideo)
//DELETE
router.delete('/:id', verifyToken, deleteVideo)
//FIND ONE
router.get('/find/:id', getVideo)
//ADD VIEW
router.put('/views/:id', addView)
//GET TREND
router.get('/trend', trend)
//GET RANDOM
router.get('/random', random)
//SUB TO A CHANNEL/USER
router.get('/sub', verifyToken, sub)
//GET BY TAGS
router.get('/tags', getByTag)
//SEARCH BY KEYWORD
router.get('/search', search)


export default router