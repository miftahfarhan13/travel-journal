import express from 'express'
import { isAdmin } from '../middleware/useIsAdmin.js'
import { createPromo, deletePromo, getPromoById, getPromos, updatePromo } from '../controllers/PromoController.js'
import { isAuth } from '../middleware/useIsAuth.js'

const router = express.Router()

router.get('/api/v1/promos', isAuth, getPromos)
router.get('/api/v1/promo/:id', isAuth, getPromoById)
router.post('/api/v1/create-promo', isAdmin, createPromo)
router.post('/api/v1/update-promo/:id', isAdmin, updatePromo)
router.delete('/api/v1/delete-promo/:id', isAdmin, deletePromo)

export default router;