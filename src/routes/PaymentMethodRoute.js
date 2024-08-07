import express from 'express'
import { isAuth } from '../middleware/useIsAuth.js'
import { generatePaymentMethods, getPaymentMethods } from '../controllers/PaymentMethodController.js'

const router = express.Router()

router.get('/api/v1/payment-methods', isAuth, getPaymentMethods)
router.post('/api/v1/generate-payment-methods', isAuth, generatePaymentMethods)

export default router;