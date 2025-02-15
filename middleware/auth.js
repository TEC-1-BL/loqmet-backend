import jwt from "jsonwebtoken"
import kitchenOwnerModel from '../models/kitchenOwnerModel.js';

export const protectKitchenOwner = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, no token"
            });
        }

         // Debug log
         console.log('Received token:', token);
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        
        // Check if user is a kitchen owner
        const kitchenOwner = await kitchenOwnerModel.findById(decoded.id);
        
        if (!kitchenOwner) {
            return res.status(403).json({
                success: false,
                message: "Kitchen owner not found"
            });
        }

        if (decoded.role !== 'kitchen_owner') {
            return res.status(403).json({
                success: false,
                message: "Not authorized as kitchen owner"
            });
        }

        // Add kitchen owner to request object
        req.kitchenOwner = kitchenOwner;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({
            success: false,
            message: "Not authorized"
        });
    }
}

const authMiddleware = async (req,res,next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode.id;  // Attach decoded user ID to the request body
        next();
    } catch (error) {
        console.log(error);
        res.status(403).json({ success: false, message: "Invalid or Expired Token" });
    }
}

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        // Verify token and set user in request
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};

export default authMiddleware;