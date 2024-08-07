import express from 'express'
import { isAuth } from '../middleware/useIsAuth.js'
import { cancelTransaction, createTransaction, getAllTransactions, getMyTransactions, getTransactionById, updateTransactionProofPayment, updateTransactionStatus } from '../controllers/TransactionController.js'
import { isAdmin } from '../middleware/useIsAdmin.js'

const router = express.Router()

router.post('/api/v1/create-transaction', isAuth, createTransaction)
router.post('/api/v1/update-transaction-proof-payment/:id', isAuth, updateTransactionProofPayment)
router.post('/api/v1/update-transaction-status/:id', isAdmin, updateTransactionStatus)
router.post('/api/v1/cancel-transaction/:id', isAuth, cancelTransaction)
router.get('/api/v1/transaction/:id', isAuth, getTransactionById)
router.get('/api/v1/my-transactions', isAuth, getMyTransactions)
router.get('/api/v1/all-transactions', isAdmin, getAllTransactions)

export default router;