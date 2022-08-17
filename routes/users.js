import express from 'express'
import { update, del, getUser, subscribe, unsubscribe, like, dislike } from '../controllers/user.js'
import { verifyToken } from '../utils/verifyToken.js'
const router = express.Router()

//UPDATE USER
router.put('/:id', verifyToken, update)
//DELETE USER
router.delete('/:id', verifyToken, del)
//GET AN USER
router.get('/find/:id', getUser)
//SUBSCRIBE AN USER
router.put('/sub/:id', verifyToken, subscribe)
//UNSUBSCRIBE AN USER
router.put('/unsub/:id', verifyToken, unsubscribe)
//LIKE A VIDEO
router.put('/like/:videoId', verifyToken, like)
//DISLIKE A VIDEO
router.put('/dislike/:videoId', verifyToken, dislike)

export default router