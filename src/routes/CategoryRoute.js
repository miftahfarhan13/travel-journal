import express from 'express'
import { isAdmin } from '../middleware/useIsAdmin.js'
import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from '../controllers/CategoryController.js'
import { isAuth } from '../middleware/useIsAuth.js'

const router = express.Router()

router.get('/api/v1/categories', isAuth, getCategories)
router.get('/api/v1/category/:id', isAuth, getCategoryById)
router.post('/api/v1/create-category', isAdmin, createCategory)
router.post('/api/v1/update-category/:id', isAdmin, updateCategory)
router.delete('/api/v1/delete-category/:id', isAdmin, deleteCategory)

export default router;