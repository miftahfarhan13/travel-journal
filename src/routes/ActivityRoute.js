import express from 'express'
import { isAdmin } from '../middleware/useIsAdmin.js'
import { isAuth } from '../middleware/useIsAuth.js'
import { createActivity, deleteActivity, getActivities, getActivitiesByCategoryId, getActivityById, updateActivity } from '../controllers/ActivityController.js'

const router = express.Router()

router.get('/api/v1/activities', isAuth, getActivities)
router.get('/api/v1/activity/:id', isAuth, getActivityById)
router.get('/api/v1/activities-by-category/:categoryId', isAuth, getActivitiesByCategoryId)
router.post('/api/v1/create-activity', isAdmin, createActivity)
router.post('/api/v1/update-activity/:id', isAdmin, updateActivity)
router.delete('/api/v1/delete-activity/:id', isAdmin, deleteActivity)

export default router;