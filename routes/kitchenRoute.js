import express from 'express';
import { getProfile, updateProfile, deleteProfile, getKitchenWithMenu, getAllKitchenOwners, getKitchenOwnerById } from '../controllers/kitchenController.js';
import { authenticateToken } from '../middleware/auth.js';
import multer from 'multer';
const router = express.Router();

const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})
const upload = multer({storage:storage})

router.get('/all', getAllKitchenOwners);
router.get('/:id', getKitchenOwnerById);
router.get('/:id/menu', getKitchenWithMenu);


// Get the kitchen owner's profile
router.get('/profile/:id', authenticateToken, getProfile);



// Update the kitchen owner's profile
//router.put('/profile', authenticateToken, updateProfile);
router.put('/profile', authenticateToken, upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'backgroundPhoto', maxCount: 1 }
]), updateProfile);
 
// Delete the kitchen owner's profile
router.delete('/profile', authenticateToken, deleteProfile);



export default router;
