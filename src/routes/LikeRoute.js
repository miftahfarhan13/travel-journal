import express from 'express'
import { likeFood, unlikeFood } from '../controllers/LikeController.js'
import { isAuth } from '../middleware/isAuth.js'

const router = express.Router()

router.post('/api/v1/like', isAuth, likeFood)
router.post('/api/v1/unlike', isAuth, unlikeFood)

export default router;