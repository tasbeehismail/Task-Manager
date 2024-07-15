import AppError from '../utils/appError.js';
import Category from '../models/category.js';

export const addCategory = async (req, res, next) => {
    const user_id = req.user._id;
    const { name } = req.body;
    const category = new Category({ name, user_id });
    await category.save();
    res.status(201).json({ message: 'Category created successfully', data: category });
}

export const getCategories = async (req, res, next) => {
    const user_id = req.user._id;
    const { page = 1, limit = 10, sortBy = 'name', order = 'asc' } = req.query;
    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    const categories = await Category.find({ user_id })
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({ data: categories });
}

export const getCategory = async (req, res, next) => {
    const user_id = req.user._id;
    const { id } = req.params;
    const category = await Category.findOne({ _id: id, user_id });
    if (!category) {
        return next(new AppError('Category not found or unauthorized access', 404));
    }
    res.status(200).json({ data: category });
}

export const updateCategory = async (req, res, next) => {
    const user_id = req.user._id;
    const { id } = req.params;
    const { name } = req.body;
    const category = await Category.findOneAndUpdate({ _id: id, user_id }, { name }, { new: true });
    if (!category) {
        return next(new AppError('Category not found or unauthorized access', 404));
    }
    res.status(200).json({ message: 'Category updated successfully', data: category });
}

export const deleteCategory = async (req, res, next) => {
    const user_id = req.user._id;
    const { id } = req.params;
    const category = await Category.findOneAndDelete({ _id: id, user_id });
    if (!category) {
        return next(new AppError('Category not found or unauthorized access', 404));
    }
    res.status(200).json({ message: 'Category deleted successfully' });
}