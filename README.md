# Delic - Backend

Delic is an online restaurant application backend built with **Node.js** and **Express**.

## Features
- User authentication & authorization
- Menu management
- Order processing
- Payment integration
- Middleware for validation & error handling
- Database migrations & models

## Tech Stack
- **Node.js**
- **Express.js**
- **Sequelize (ORM)**
- **PostgreSQL**
- **Multer (for file uploads)**

## Folder Structure
```
Delic_Restaurant/
│── config/         # Configuration files
│── controller/     # Route controllers
│── middlewares/    # Middleware functions
│── migrations/     # Database migrations
│── models/         # Database models
│── routes/         # API route definitions
│── utils/          # Utility functions
│── index.js        # Application entry point
```

## Installation
```sh
git clone git@github.com:Zobamba/Delic.git
cd Delic
npm install
```

## Environment Variables
Create a `.env` file in the root directory and add:
```env
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

## Running the Application
### Start Server
```sh
npm start
```

## Example API Endpoints
| Method | Endpoint         | Description          |
|--------|-----------------|----------------------|
| POST   | /sign_up        | Sign Up             |
| POST   | /sign_in        | Login               |
| GET    | /menus          | Get all menu items  |
| POST   | /menus          | Create menu item    |
| POST   | /orders         | Place a new order   |
| GET    | /orders         | Get user orders     |

## License
MIT License

