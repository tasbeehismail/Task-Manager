import { Router } from "express";
import * as categoryController from '../controllers/categories.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as schema from "../validation/category.js";
import { validate } from "../services/validator.service.js";
import { verifyToken } from "../services/auth.service.js";

const router = Router();

router.post('/add', 
    verifyToken(), 
    validate(schema.addCategory), 
    asyncHandler(categoryController.addCategory)
);

router.get('/all', 
    verifyToken(), 
    asyncHandler(categoryController.getCategories)
);

router.get('/:id', 
    verifyToken(), 
    validate(schema.getCategory), 
    asyncHandler(categoryController.getCategory)
);

router.patch('/update/:id', 
    verifyToken(), 
    validate(schema.updateCategory), 
    asyncHandler(categoryController.updateCategory)
);  

router.delete('/delete/:id', 
    verifyToken(), 
    validate(schema.deleteCategory), 
    asyncHandler(categoryController.deleteCategory)
);


export default router;