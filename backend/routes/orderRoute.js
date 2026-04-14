import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { listOrders, placeOrder, verifyOrder, userOrders, updateStatus } from '../controllers/orderController.js';
import adminAuthMiddleware from '../middleware/adminAuth.js';

const orderRouter = express.Router();


orderRouter.post('/place', authMiddleware, placeOrder);
orderRouter.post('/verify', verifyOrder);
orderRouter.post ('/userorders',authMiddleware, userOrders)
orderRouter.get('/list', adminAuthMiddleware, listOrders)
orderRouter.post('/status', adminAuthMiddleware, updateStatus)


export default orderRouter;