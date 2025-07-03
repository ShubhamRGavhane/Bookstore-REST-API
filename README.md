# 📚 Bookstore REST API

A simple RESTful API for managing a bookstore with user authentication and file-based persistence. Built with **Node.js**, **Express**, and **JWT** for secure access.  

> ✅ Supports CRUD operations  
> ✅ Secured with token-based authentication  
> ✅ Stores data in JSON files (no database required)  
> ✅ Includes filtering, pagination, and user access control

---

## 🔧 Features

### ✅ Authentication

- `POST /auth/register` – Register a new user (email, password)
- `POST /auth/login` – Login and receive a JWT token

> All `/books` endpoints are protected and require a valid JWT token.

### ✅ Book Management

- `GET /books` – List all books
- `GET /books/:id` – Get book by ID
- `POST /books` – Add a new book
- `PUT /books/:id` – Update a book by ID
- `DELETE /books/:id` – Delete a book by ID

Each book includes:

```json
{
  "id": "auto-generated UUID",
  "title": "string",
  "author": "string",
  "genre": "string",
  "publishedYear": number,
  "userId": "ID of user who added the book"
}
