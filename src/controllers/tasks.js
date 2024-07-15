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
    const { page = 1, limit = 10, category, shared, sortBy = 'category', order = 'asc' } = req.query;
    const filter = {};
    
    // Apply filters
    // 1- By task shared option (Public/Private)
    // If user is authenticated
    if (req.user) {
        // show tasks created by the user and the tasks shared with the user
        filter['$or'] = [{ user_id: req.user._id }, { shared: shared === 'true' }];
    } else {
        // If the user is unauthenticated, only show shared tasks
        filter['shared'] = shared === 'true';
    }

    // 2- By category name
    if (category) {
        // Find all categories that match name 
        const categories = await Category.find({ name: { $regex: category, $options: 'i' } });
        if (categories.length > 0) {
            // Add the category ID to the filter
            filter['category_id'] = { $in: categories.map(category => category._id) };  
        } else {
            return res.status(404).send({ message: 'Category not found' });
        }
    }

    // Convert limit and page to integers
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const skip = (pageInt - 1) * limitInt;

    // Build the sort options
    const sortOptions = {};
    if (sortBy === 'category') {
        sortOptions['category.name'] = order === 'asc' ? 1 : -1;
    } else if (sortBy === 'shared') {
        sortOptions['shared'] = order === 'asc' ? 1 : -1;
    }

    // Aggregate pipeline to sort by populated field
    const tasks = await Task.aggregate([
        { $match: filter },
        { $lookup: { from: 'categories', localField: 'category_id', foreignField: '_id', as: 'category' } },
        { $unwind: '$category' },
        { $sort: sortOptions },
        { $skip: skip },
        { $limit: limitInt },
        {
            $project: {
                _id: 1,
                title: 1,
                type: 1,
                text_body: 1,
                list_items: 1,
                shared: 1,
                user_id: 1,
                createdAt: 1,
                updatedAt: 1,
                category: { name: 1, _id: 1 },
            }
        }
    ]);

    res.status(200).json({ data: tasks });
}

export const getTask = async (req, res, next) => {
    const filter = {};
    if (req.user) {
        filter['$or'] = [{ user_id: req.user._id }, { shared: true }];
    } else {
        // If the user is unauthenticated, only show shared tasks
        filter['shared'] = true;
    }
    const { id } = req.params;
    
    const task = await Task.findOne({ _id: id, ...filter }).populate('category_id', 'name');
    if (!task) {
        return next(new AppError('Task not found or unauthorized access', 404));
    }
    res.status(200).json({ data: task });
}

export const updateTask = async (req, res, next) => {
    const user_id = req.user._id;
    const { id } = req.params;
    const task = await Task.findOneAndUpdate({ _id: id, user_id }, req.body, { new: true });
    if (!task) {
        return next(new AppError('Task not found or unauthorized access', 404));
    }
    res.status(200).json({ message: 'Task updated successfully', data: task });
}

export const deleteTask = async (req, res, next) => {
    const user_id = req.user._id;
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, user_id });
    if (!task) {
        return next(new AppError('Task not found or unauthorized access', 404));
    }
    res.status(200).json({ message: 'Task deleted successfully' });
}
