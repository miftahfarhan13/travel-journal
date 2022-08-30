import express from 'express'
import { getAllUser, getUserLogin, loginUser, registerUser, updateProfileUser, updateProfileUserRole } from '../controllers/UserController.js'
import { isAdmin } from '../middleware/isAdmin.js'
import { isAuth } from '../middleware/isAuth.js'

const router = express.Router()

router.post('/api/v1/register', isAuth, registerUser)
router.post('/api/v1/update-profile', isAuth, updateProfileUser)
router.post('/api/v1/update-user-role/:userId', isAdmin, updateProfileUserRole)
router.post('/api/v1/login', isAuth, loginUser)
router.get('/api/v1/user', isAuth, getUserLogin)
router.get('/api/v1/all-user', isAdmin, getAllUser)

export default router;