import { Router } from "express";
import userRouter from './user.routes.js';
import taskRouter from './task.routes.js';
import categoryRouter from './category.routes.js';
import AppError from "../utils/appError.js";

const app = Router();

app.use('/auth', userRouter);
app.use('/tasks', taskRouter);
app.use('/categories', categoryRouter)

app.use('*', (req, res, next) => {
    next (new AppError ('invalid routing path ' + req.originalUrl, 404)); 
});

export default app;