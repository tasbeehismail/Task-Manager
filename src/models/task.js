import mongoose from 'mongoose';

const { Schema } = mongoose;

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Text', 'List'],
    required: true,
  },
  text_body: {
    type: String,
    required: false,
  },
  list_items: {
    type: [String],
    required: false,
  },
  shared: {
    type: Boolean,
    default: false,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

export default Task;
