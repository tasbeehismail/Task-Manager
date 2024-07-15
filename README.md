# Task-Manager

A RESTful API for efficient task and category management with user authentication, sharing options, and advanced filtering.

## Features

- **User Authentication**: Basic HTTP authentication (username and password).
- **Email Verification**: Users can verify their email addresses.
- **Task Management**: Create, read, update, and delete tasks.
- **Category Management**: Organize tasks into categories with full CRUD support.
- **Task Sharing**: Tasks can be shared (public) or private.
- **Task Types**: Support for text tasks and list tasks.
- **Filtering**: Filter tasks by category name and shared options (public/private).
- **Sorting**: Sort tasks by category name and shared options (public/private).
- **Pagination**: Efficiently paginate through tasks and categories.

## Models

- **User**
  - name: String
  - email: String
  - password: String

- **Category**
  - name: String
  - user: Reference to User

- **Task**
  - title: String
  - body: String (for text tasks)
  - items: Array of Strings (for list tasks)
  - category: Reference to Category
  - shared: Boolean (public/private)
  - user: Reference to User

## Schema Diagram 
![Schema Diagram](https://github.com/tasbeehismail/Task-Manager/blob/main/schema-diagram.png)

## Endpoints

### User
- `POST /users/signup`: Create a new user
- `POST /users/login`: User login
- `POST /users/verify-email`: Verify user email

### Categories
- `GET /categories`: Get all categories
- `POST /categories/add`: Create a new category
- `GET /categories/:id`: Get a category by ID
- `PATCH /categories/update/:id`: Update a category by ID
- `DELETE /categories/delete/:id`: Delete a category by ID

### Tasks
- `GET /tasks`: Get all tasks
  - Supports query parameters for filtering, sorting, and pagination:
    - `page`: Page number (default: 1)
    - `limit`: Number of tasks per page (default: 10)
    - `category`: Filter by category name
    - `shared`: Filter by shared option (`public` or `private`)
    - `sortBy`: Sort by `category` or `shared` (default: `category`)
    - `order`: Order of sorting (`asc` or `desc`, default: `asc`)
- `POST /tasks/create`: Create a new task
- `GET /tasks/:id`: Get a task by ID
- `PATCH /tasks/update/:id`: Update a task by ID
- `DELETE /tasks/delete/:id`: Delete a task by ID

### Filtering and Sorting
- `GET /tasks?category=:categoryName`: Get tasks filtered by category name
- `GET /tasks?shared=:sharedOption`: Get tasks filtered by shared option (public/private)
- `GET /tasks?sortBy=category&order=asc`: Get tasks sorted by category name
- `GET /tasks?sortBy=shared&order=desc`: Get tasks sorted by shared option (public/private)
- `GET /tasks?page=:page&limit=:limit`: Paginate through tasks

# API Documentation
[Link to Detailed Postman Documentation](https://documenter.getpostman.com/view/34627138/2sA3kPoiux)
