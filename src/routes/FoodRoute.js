import express from 'express'
import { createFood, deleteFood, getFoodById, getFoods, getUserFoods, updateFood } from "../controllers/FoodController.js"
import { isAdmin } from '../middleware/isAdmin.js'
import { isAuth } from '../middleware/isAuth.js'

const router = express.Router()

router.get('/api/v1/foods', isAuth, getFoods)
router.get('/api/v1/like-foods', isAuth, getUserFoods)
router.get('/api/v1/foods/:id', isAuth, getFoodById)
router.post('/api/v1/create-food', isAdmin, createFood)
router.post('/api/v1/update-food/:id', isAdmin, updateFood)
router.delete('/api/v1/delete-food/:id', isAdmin, deleteFood)

export default router;