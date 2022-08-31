import express from 'express'
import { getRatingByFood, rateFood } from '../controllers/RatingController.js'
import { isAuth } from '../middleware/isAuth.js'

const router = express.Router()

router.post('/api/v1/rate-food/:foodId', isAuth, rateFood)
router.get('/api/v1/food-rating/:foodId', isAuth, getRatingByFood)

export default router;