import { Router } from "express";
import * as userController from '../controllers/users.js';
import { checkEmail } from "../middleware/checkEmail.js";
import asyncHandler from '../utils/asyncHandler.js';
import * as schema from "../validation/user.js";
import { validate } from "../services/validator.service.js";

const router = Router();

router.post('/signup', 
  validate(schema.signUp), 
  asyncHandler(checkEmail), 
  asyncHandler(userController.signup)
);

router.post('/login', 
  validate(schema.logIn), 
  asyncHandler(userController.login)
);

router.post('/verify-email', 
  validate(schema.verifyEmail),
  asyncHandler(userController.verifyEmail)
);

export default router;