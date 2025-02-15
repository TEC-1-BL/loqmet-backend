import bcrypt from 'bcrypt';
import deliveryModel from '../models/deliverymodel.js';

const deliveryController = {
  // Add delivery company
  addDelivery: async (req, res) => {
    try {
      const { name, email, password, phoneNumber, location, vehicleType, availableFrom, availableTo } = req.body;
      
      // Check if email already exists
      const existingDelivery = await deliveryModel.findOne({ email });
      if (existingDelivery) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
      }
  
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newDelivery = new deliveryModel({
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        location,
        vehicleType,
        availableFrom,
        availableTo,
        accountType: 'Delivery'
      });
  
      const savedDelivery = await newDelivery.save();
  
      res.status(201).json({ success: true, message: 'Delivery company added', data: savedDelivery });
    } catch (error) {
      console.error('Error adding delivery company:', error);
      res.status(500).json({ success: false, message: 'Error adding delivery company', error: error.message });
    }
  },

  // Update delivery company
  updateDelivery: async (req, res) => {
    try {
      const { id } = req.params;
      const updateFields = {};

      // Only add fields that are present in the request body
      if (req.body.name) updateFields.name = req.body.name;
      if (req.body.person) updateFields.person = req.body.person;
      if (req.body.email) updateFields.email = req.body.email;
      if (req.body.phoneNumber) updateFields.phoneNumber = req.body.phoneNumber;
      if (req.body.location) updateFields.location = req.body.location;
      if (req.body.vehicleType) updateFields.vehicleType = req.body.vehicleType;
      if (req.body.availableFrom) updateFields.availableFrom = req.body.availableFrom;
      if (req.body.availableTo) updateFields.availableTo = req.body.availableTo;
      if (req.body.deliveryzones) updateFields.deliveryzones = req.body.deliveryzones;

      const updatedDelivery = await deliveryModel.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true, runValidators: true }
      );

      if (!updatedDelivery) {
        return res.status(404).json({ 
          success: false, 
          message: 'Delivery company not found' 
        });
      }

      res.json({ 
        success: true, 
        message: 'Delivery company updated', 
        data: updatedDelivery 
      });
    } catch (error) {
      console.error('Error updating delivery company:', error.message);
      res.status(500).json({ 
        success: false, 
        message: 'Error updating delivery company', 
        error: error.message 
      });
    }
  },

  getDeliveryProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const delivery = await deliveryModel.findById(id).select('-password');
  
      if (!delivery) {
        return res.status(404).json({
          success: false,
          message: 'Delivery profile not found'
        });
      }
  
      res.json({
        success: true,
        data: delivery
      });
    } catch (error) {
      console.error('Error fetching delivery profile:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching delivery profile',
        error: error.message
      });
    }
  },

  // Delete delivery company
  deleteDelivery: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedDelivery = await deliveryModel.findByIdAndDelete(id);

      if (!deletedDelivery) {
        return res.status(404).json({ success: false, message: 'Delivery company not found' });
      }

      res.json({ success: true, message: 'Delivery company deleted successfully' });
    } catch (error) {
      console.error('Error deleting delivery company:', error.message);
      res.status(500).json({ success: false, message: 'Error deleting delivery company', error: error.message });
    }
  }
};

export default deliveryController;
