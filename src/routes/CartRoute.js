import express from 'express'
import { isAuth } from '../middleware/useIsAuth.js'
import { addToCart, deleteCart, getCarts, updateTotalCartItem } from '../controllers/CartController.js'

const router = express.Router()

router.get('/api/v1/carts', isAuth, getCarts)
router.post('/api/v1/add-cart', isAuth, addToCart)
router.post('/api/v1/update-cart/:id', isAuth, updateTotalCartItem)
router.delete('/api/v1/delete-cart/:id', isAuth, deleteCart)

export default router;