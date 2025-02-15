import foodModel from '../models/foodModel.js';
import kitchenOwnerModel from '../models/kitchenOwnerModel.js';
import fs from 'fs'

//add food item
const addFood = async (req,res) =>{
    try {
        if (!req.kitchenOwner) {
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized - Please login first"
            });
        }
        // Get kitchen owner ID from authenticated user
        const kitchenOwnerId = req.kitchenOwner._id;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image"
            });
        }

        let image_filename = `${req.file.filename}`;

        const categories = Array.isArray(req.body.category) ? req.body.category : JSON.parse(req.body.category);
         // Parse flavors only if it's a string
        let parsedFlavors = [];
        if (typeof req.body.flavors === 'string') {
            try {
                parsedFlavors = JSON.parse(req.body.flavors);
            } catch (err) {
                console.error("Error parsing flavors", err);
                return res.status(400).json({
                    success: false,
                    message: "Invalid flavors format"
                });
            }
        } else if (Array.isArray(req.body.flavors)) {
            parsedFlavors = req.body.flavors;
        }

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: categories,
            Image: image_filename,
            prepTime: req.body.prepTime,  // Save prepTime
            flavors: parsedFlavors, 
            kitchenOwner: kitchenOwnerId
        });

        await food.save();
        await kitchenOwnerModel.findByIdAndUpdate(kitchenOwnerId, { $push: { menu: food._id } });
        res.json({success: true, message: "Food Added"});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Error adding food item"});
    }
}

 
const listFood = async (req, res) => {
    try {
        // Check if kitchen owner is authenticated
        if (!req.kitchenOwner) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - Please login first"
            });
        }

        const foods = await foodModel.find({ kitchenOwner: req.kitchenOwner._id });
        res.json({
            success: true,
            data: foods
        });
    } catch (error) {
        console.error("Error listing food:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching food items"
        });
    }
};

// Get all food items from all kitchen owners
const getAllFood = async (req, res) => {
    try {
        const foods = await foodModel.find()
            .populate('kitchenOwner', 'name') // Optional: if you want to include kitchen owner details
            .sort({ createdAt: -1 }); // Optional: sort by newest first

        res.json({
            success: true,
            data: foods
        });
    } catch (error) {
        console.error("Error fetching all food:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching food items"
        });
    }
};


//remove food item
const removeFood = async (req,res) =>{
    try{
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food item not found"
            });
        }

        fs.unlink(`uploads/${food.Image}`, (err) => {
            if (err) {
                console.error("Error deleting image:", err);
            }
        });

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message:"Food Removed"});
    } catch (error){
        console.log(error);
        res.status(500).json({success:false, message:"Error removing food item"});
    }
}

// Get menu items for a specific kitchen owner
const getKitchenMenu = async (req, res) => {
    try {
        const menuItems = await foodModel.find({ kitchenOwner: req.params.kitchenOwnerId });
        res.json({
            success: true,
            data: menuItems
        });
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching menu items'
        });
    }
};

const toggleAvailability = async (req, res) => {
    try {
        const { id, available } = req.body; // Food ID and updated availability
        const food = await foodModel.findById(id);

        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food item not found",
            });
        }

        food.available = available; // Update availability
        await food.save(); // Save changes

        res.json({
            success: true,
            message: "Availability updated successfully",
            data: food,
        });
    } catch (error) {
        console.error("Error toggling availability:", error);
        res.status(500).json({
            success: false,
            message: "Error updating availability",
        });
    }
};
// Update food item
const updateFood = async (req, res) => {
    try {
        const { id, name, price, description, category, prepTime, flavors } = req.body;

        // Find the food item by ID
        const food = await foodModel.findById(id);

        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food item not found",
            });
        }

        // Update food item fields
        food.name = name || food.name;
        food.price = price || food.price;
        food.description = description || food.description;
        food.category = category || food.category;
        food.prepTime = prepTime || food.prepTime;
        food.flavors = flavors || food.flavors;

        // Save the updated food item
        await food.save();

        res.json({
            success: true,
            message: "Food item updated successfully",
            data: food,
        });
    } catch (error) {
        console.error("Error updating food item:", error);
        res.status(500).json({
            success: false,
            message: "Error updating food item",
        });
    }
};



export { addFood, listFood, removeFood, getAllFood, getKitchenMenu , toggleAvailability,updateFood }