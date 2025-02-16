import express from 'express';
import deliveryController from '../controllers/deliveryController.js';
import { body, validationResult } from 'express-validator';
import deliveryModel from '../models/deliverymodel.js';

const router = express.Router();

// Get delivery profile
router.get('/:id', deliveryController.getDeliveryProfile);

// Update delivery profile
router.put('/:id', deliveryController.updateDelivery);

// Delete delivery company
router.delete('/:id', deliveryController.deleteDelivery);

// Add new delivery company
router.post('/add', deliveryController.addDelivery);

export default router;