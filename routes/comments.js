import express from 'express'
import {verifyToken} from '../utils/verifyToken.js'
import { addComment, deleteComment, getComment } from '../controllers/comment.js'
const router = express.Router()

router.post('/', verifyToken, addComment)
router.delete('/:id', verifyToken, deleteComment)
router.get('/:videoId', getComment)

export default router