import express from "express"
import { addFood,listFood,removeFood, getAllFood, getKitchenMenu, toggleAvailability,updateFood } from "../controllers/foodController.js"
import multer from "multer"
import { protectKitchenOwner } from "../middleware/auth.js";

const foodRouter = express.Router();

// Image Storage Engine

const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage:storage})

foodRouter.get('/all', getAllFood);
foodRouter.get('/menu/:kitchenOwnerId', getKitchenMenu);


foodRouter.post("/add",protectKitchenOwner,upload.single("image"),addFood)
foodRouter.get("/list",protectKitchenOwner,listFood)
foodRouter.post("/remove",protectKitchenOwner,removeFood);
foodRouter.post('/toggle-availability',toggleAvailability);
foodRouter.post('/update', updateFood);


export default foodRouter;


