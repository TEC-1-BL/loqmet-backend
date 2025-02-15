import kitchenOwnerModel from '../models/kitchenOwnerModel.js';
import foodModel from '../models/foodModel.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import validator from "validator";
import mongoose from 'mongoose';


const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const getProfile = async (req, res) => {
  try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
          return res.status(401).json({ 
              success: false, 
              message: "No token provided" 
          });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== 'kitchenOwner') {
        return res.status(403).json({ 
            success: false, 
            message: "Unauthorized" 
        });
    }
    const kitchenOwner = await kitchenOwnerModel.findById(decoded.id).select('-password');
    
      
      if (!kitchenOwner) {
          return res.status(404).json({ 
              success: false, 
              message: "Kitchen owner not found" 
          });
      }

      res.json({ 
          success: true, 
          data: kitchenOwner
      });
  } catch (error) {
      console.error("Profile fetch error:", error);
      res.status(500).json({ 
          success: false, 
          message: "Error fetching profile" 
      });
  }
};


const updateProfile = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "No token provided" 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get the updated fields for the main profile form
        const updateFields = {};
        const allowedFields = [
            'name', 'nationalId', 'phoneNumber', 'age', 
            'experience', 'email', 'availableFrom', 
            'availableTo', 'city', 'gender', 'bio', 
            'instagramLink', 'facebookLink'
        ];

        // Handle regular form fields
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                if (req.body[field] === '' || req.body[field] === null) {
                    // If the field is empty or null, set it to null in the database
                    updateFields[field] = null;
                } else {
                    updateFields[field] = req.body[field];
                }
            }
        });

        // Handle file uploads
        if (req.files) {
            if (req.files.profilePhoto) {
                updateFields.profilePhoto = req.files.profilePhoto[0].path;
            }
            if (req.files.backgroundPhoto) {
                updateFields.backgroundPhoto = req.files.backgroundPhoto[0].path;
            }
        }
        
        if (updateFields.facebookLink && updateFields.facebookLink !== null) {
            if (!validator.isURL(updateFields.facebookLink, { protocols: ['http', 'https'], require_protocol: true })) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Facebook URL"
                });
            }
        }
        if (updateFields.instagramLink && updateFields.instagramLink !== null) {
            if (!validator.isURL(updateFields.instagramLink, { protocols: ['http', 'https'], require_protocol: true })) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Instagram URL"
                });
            }
        }

        
        // Validate email if it's being updated
        if (updateFields.email && !validator.isEmail(updateFields.email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email"
            });
        }

        // Update the kitchen owner document
        const updatedProfile = await kitchenOwnerModel.findByIdAndUpdate(
            decoded.id,
            { $set: updateFields },
            { 
                new: true,
                runValidators: true
            }
        ).select('-password');

        if (!updatedProfile) {
            return res.status(404).json({ 
                success: false, 
                message: "Kitchen owner profile not found" 
            });
        }

        res.json({ 
            success: true, 
            data: updatedProfile,
            message: "Profile updated successfully"
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating profile' 
        });
    }
};

const deleteProfile = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "No token provided" 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const kitchenOwnerId = decoded.id;

        if (decoded.id !== req.body.id) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own profile"
            });
        }

        const deletedKitchen = await kitchenOwnerModel.findByIdAndDelete(kitchenOwnerId);

        if (!deletedKitchen) {
            return res.status(404).json({ 
                success: false, 
                message: "Kitchen owner not found" 
            });
        }

        res.json({ 
            success: true, 
            message: 'Kitchen account deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting kitchen account:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete kitchen account' 
        });
    }
};

const getKitchenWithMenu = async (req, res) => {
    
    try {
        const { id } = req.params;

        // Find the kitchen owner and populate the menu field with all food details
        const kitchenOwner = await kitchenOwnerModel.findById(id)
            .populate({
                path: 'menu',
                select: 'name description price Image category'
            });

        if (!kitchenOwner) {
            return res.status(404).json({ 
                success: false, 
                message: "Kitchen owner not found" 
            });
        }

        res.json({ 
            success: true, 
            data: kitchenOwner 
        });
    } catch (error) {
        console.error('Error fetching kitchen with menu:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch kitchen with menu' 
        });
    }
};

// Get all kitchen owners
const getAllKitchenOwners = async (req, res) => {
    try {
        const { city } = req.query;  // Get city from query parameter (e.g., ?city=Amman)
        
        let kitchenOwners;
        if (city) {
            // If city is specified, filter by city
            kitchenOwners = await kitchenOwnerModel.find({ city })
                .select('name specialty description profilePhoto coverPhoto');
        } else {
            // If no city is specified, return all kitchen owners
            kitchenOwners = await kitchenOwnerModel.find()
                .select('name specialty description profilePhoto coverPhoto');
        }

        res.json({
            success: true,
            data: kitchenOwners
        });
    } catch (error) {
        console.error('Error fetching kitchen owners:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching kitchen owners'
        });
    }
};


// Get specific kitchen owner by ID 
const getKitchenOwnerById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate the ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid kitchen owner ID"
            });
        }
        const kitchenOwner = await kitchenOwnerModel
          .findById(req.params.id)
          .populate('menu'); // Populate the menu field with food items
    
        if (!kitchenOwner) {
          return res.status(404).json({ success: false, message: "Kitchen owner not found" });
        }
    
        res.json({
          success: true,
          data: kitchenOwner
        });
      } catch (error) {
        console.error('Error fetching kitchen owner by ID:', error);
        res.status(500).json({
          success: false,
          message: 'Error fetching kitchen owner'
        });
      }
    };

export { getProfile, updateProfile, deleteProfile, getKitchenWithMenu, getAllKitchenOwners, getKitchenOwnerById };
