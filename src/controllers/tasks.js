import AppError from '../utils/appError.js';
import Task from '../models/task.js';
import Category from '../models/category.js';

export const createTask = async (req, res, next) => {
    const user_id = req.user._id;
    const task = await Task.create({ ...req.body, user_id });
    res.status(201).json({
        message: 'Task created successfully',
        data: task,
    });
}

export const getTasks = async (req, res, next) => {
    const { page = 1, limit = 10, category, shared, sortBy = 'shared', order = 'asc' } = req.query;
    const filter = { };
    if (req.user) {
        filter['$or'] = [{ user_id: req.user._id }, { shared: true }];
      } else {
        // If the user is unauthenticated, only show shared tasks
        filter['shared'] = true;
      }

    // Apply filters
    if (category) {
        const categoryDoc = await Category.findOne({ name: category });
        if (categoryDoc) {
            filter['category_id'] = categoryDoc._id;
        } else {
            return res.status(404).send({ message: 'Category not found' });
        }
    }

    if (shared !== undefined) {
        filter['shared'] = shared === 'true';
    }
    console.log(filter);

    // Build the sort options
    const sortOptions = {};
    if (sortBy === 'category') {
        sortOptions['category_id'] = order === 'asc' ? 1 : -1;
    } else if (sortBy === 'shared') {
        sortOptions['shared'] = order === 'asc' ? 1 : -1;
    }

    const tasks = await Task.find(filter)
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate('category_id', 'name'); // Populating the category name for easier sorting

    res.status(200).json({ data: tasks });
}

export const getTask = async (req, res, next) => {
    if (req.user) {
        filter['$or'] = [{ user_id: req.user._id }, { shared: true }];
    } else {
        // If the user is unauthenticated, only show shared tasks
        filter['shared'] = true;
    }
    const { id } = req.params;
    
    const task = await Task.findOne({ _id: id, ...filter }).populate('category_id', 'name');
    if (!task) {
        return next(new AppError('Task not found', 404));
    }
    res.status(200).json({ data: task });
}

export const updateTask = async (req, res, next) => {
    const user_id = req.user._id;
    const { id } = req.params;
    const task = await Task.findOneAndUpdate({ _id: id, user_id }, req.body, { new: true });
    if (!task) {
        return next(new AppError('Task not found', 404));
    }
    res.status(200).json({ message: 'Task updated successfully', data: task });
}

export const deleteTask = async (req, res, next) => {
    const user_id = req.user._id;
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, user_id });
    if (!task) {
        return next(new AppError('Task not found', 404));
    }
    res.status(200).json({ message: 'Task deleted successfully' });
}
