import express from 'express'
import { isAdmin } from '../middleware/useIsAdmin.js'
import { createBanner, deleteBanner, getBannerById, getBanners, updateBanner } from '../controllers/BannerController.js'

const router = express.Router()

router.get('/api/v1/banners', getBanners)
router.get('/api/v1/banner/:id', getBannerById)
router.post('/api/v1/create-banner', isAdmin, createBanner)
router.post('/api/v1/update-banner/:id', isAdmin, updateBanner)
router.delete('/api/v1/delete-banner/:id', isAdmin, deleteBanner)

export default router;