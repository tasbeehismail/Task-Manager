import { Router } from "express";
import * as taskController from '../controllers/tasks.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as schema from "../validation/task.js";
import { validate } from "../services/validator.service.js";
import { verifyToken } from "../services/auth.service.js";

const router = Router();

router.post('/create', 
    verifyToken(), 
    validate(schema.createTask), 
    asyncHandler(taskController.createTask)
);

router.get('/list', 
    verifyToken(), 
    asyncHandler(taskController.list)
);

router.get('/:id', 
    verifyToken(), 
    validate(schema.getTask), 
    asyncHandler(taskController.getTask)
);

router.patch('/update/:id', 
    verifyToken(), 
    validate(schema.updateTask), 
    asyncHandler(taskController.updateTask)
);  

router.delete('/delete/:id', 
    verifyToken(), 
    validate(schema.deleteTask), 
    asyncHandler(taskController.deleteTask)
);


export default router;