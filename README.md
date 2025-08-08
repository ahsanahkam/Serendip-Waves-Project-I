# Serendip Waves - Cruise Management System

A comprehensive full-stack cruise management system built with React frontend and PHP backend, designed to manage cruise bookings, cabin administration, and customer services.

## 🚢 Project Overview

Serendip Waves is a modern cruise management platform that provides:
- Customer registration and authentication
- Cruise booking and cabin management
- Admin dashboard for cruise operations
- Email verification and password recovery
- Dynamic cruise and cabin filtering
- Real-time booking status tracking

## 🏗️ Project Structure

```
Project-I/
├── README.md
├── package.json
├── backend/                              # PHP Backend API
│   ├── Main Classes/                     # Core PHP Classes
│   │   ├── Customer.php                  # Customer management class
│   │   ├── Mailer.php                    # Email handling class
│   │   └── User.php                      # User authentication class
│   ├── phpmailer/                        # Email library
│   │   ├── src/                          # PHPMailer source files
│   │   ├── language/                     # Multi-language support
│   │   └── composer.json                 # PHPMailer dependencies
│   ├── profile_images/                   # User profile image storage
│   ├── api/                              # API endpoints (if any)
│   ├── config/                           # Configuration files
│   ├── sql/                              # Database schema files
│   ├── DbConnector.php                   # Database connection handler
│   ├── login.php                         # User login API
│   ├── customersignup.php                # Customer registration API
│   ├── changePassword.php               # Password change API
│   ├── emailValidationOTP.php           # Email verification API
│   ├── generateOTP.php                   # OTP generation API
│   ├── getShipDetails.php               # Ship/cruise data API
│   ├── getCabins.php                     # Cabin data API
│   ├── cabinManagement.php              # Cabin CRUD operations
│   └── add_profile_image_column.sql      # Database migration
└── frontend/                             # React Frontend
    ├── package.json                      # Frontend dependencies
    ├── my-vue-app/                       # Main React application
    │   ├── public/                       # Static assets
    │   ├── src/                          # React source code
    │   │   ├── assets/                   # Images, logos, etc.
    │   │   ├── components/               # Reusable React components
    │   │   ├── CabinAdminDashboard.jsx   # Admin cabin management
    │   │   ├── OurDining.jsx             # Dining options component
    │   │   ├── AuthContext.jsx           # Authentication context
    │   │   └── App.jsx                   # Main application component
    │   ├── index.html                    # HTML template
    │   ├── package.json                  # React app dependencies
    │   ├── vite.config.js                # Vite configuration
    │   ├── eslint.config.js              # ESLint configuration
    │   └── README.md                     # React app documentation
    └── Serendip_Waves-Backend/           # Additional backend files
        ├── api/                          # Extended API endpoints
        ├── config/                       # Configuration files
        ├── sql/                          # Additional SQL files
        └── README.md                     # Backend documentation
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and dev server
- **Bootstrap 5** - CSS framework for responsive design
- **React Bootstrap** - Bootstrap components for React
- **React Icons** - Icon library (Font Awesome)
- **React Router** - Client-side routing (if implemented)

### Backend
- **PHP 8+** - Server-side scripting
- **MySQL** - Relational database
- **PHPMailer** - Email sending library
- **CORS Headers** - Cross-origin resource sharing

### Development Tools
- **ESLint** - JavaScript linting
- **Git** - Version control
- **XAMPP** - Local development environment

## 🚀 Features

### Customer Features
- **User Registration** - Secure account creation with email verification
- **Authentication** - Login/logout with session management
- **Password Recovery** - Forgot password with OTP verification
- **Profile Management** - Update profile with image upload
- **Cruise Browsing** - View available cruises and ships
- **Cabin Booking** - Book cabins with real-time availability
- **Dining Options** - Browse meal options and dining services

### Admin Features
- **Cabin Management Dashboard** - Comprehensive cabin administration
- **Dynamic Filtering** - Filter by cruise name, cabin type, status
- **Real-time Status Updates** - Update cabin availability and status
- **Booking Overview** - View all bookings with passenger details
- **CRUD Operations** - Create, read, update, delete cabin records
- **Search Functionality** - Search by passenger name, cabin number, etc.

### System Features
- **Responsive Design** - Mobile-first responsive UI
- **Real-time Data** - Dynamic data fetching from backend APIs
- **Error Handling** - Comprehensive error management
- **Security** - SQL injection prevention, input validation
- **Email Services** - Automated email notifications
- **Database Integration** - Structured MySQL database design

## 📋 Prerequisites

Before running this project, make sure you have:

- **XAMPP** (PHP 8.0+, MySQL, Apache)
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- Modern web browser (Chrome, Firefox, Safari, Edge)

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Abinath7/Serendip-Waves-Backend.git
cd Project-I
```

### 2. Backend Setup (PHP/MySQL)

#### Start XAMPP Services
```bash
# Start Apache and MySQL services in XAMPP Control Panel
```

#### Database Setup
1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Create a new database named `serendip_waves`
3. Import the SQL files from `backend/sql/` directory
4. Run additional migration files if present

#### Configure Database Connection
Update `backend/DbConnector.php` with your database credentials:
```php
<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "serendip_waves";
?>
```

#### Email Configuration
Configure email settings in `backend/Main Classes/Mailer.php`:
```php
// Update SMTP settings for email functionality
$mail->Host = 'your-smtp-server.com';
$mail->Username = 'your-email@domain.com';
$mail->Password = 'your-email-password';
```

### 3. Frontend Setup (React)

#### Navigate to Frontend Directory
```bash
cd frontend/my-vue-app
```

#### Install Dependencies
```bash
npm install
# or
yarn install
```

#### Environment Configuration
Create `.env` file in `frontend/my-vue-app/`:
```env
VITE_API_BASE_URL=http://localhost/Project-I/backend
VITE_APP_NAME=Serendip Waves
```

#### Start Development Server
```bash
npm run dev
# or
yarn dev
```

The React app will be available at `http://localhost:5173`

## 🔧 API Endpoints

### Authentication
- `POST /backend/login.php` - User login
- `POST /backend/customersignup.php` - Customer registration
- `POST /backend/changePassword.php` - Change password
- `POST /backend/emailValidationOTP.php` - Email verification
- `POST /backend/generateOTP.php` - Generate OTP

### Cruise Management
- `GET /backend/getShipDetails.php` - Get all ship/cruise details
- `GET /backend/getCabins.php` - Get cabin information
- `POST /backend/cabinManagement.php` - Create new cabin booking
- `PUT /backend/cabinManagement.php` - Update cabin status
- `DELETE /backend/cabinManagement.php` - Delete cabin booking

## 🗂️ Database Schema

### Key Tables
- **users** - User authentication and profile data
- **ship_details** - Cruise ship information
- **cabins** - Cabin details and availability
- **bookings** - Booking records and passenger information
- **meal_options** - Dining options and meal plans

## 🎨 UI Components

### CabinAdminDashboard.jsx
- **Purpose**: Admin interface for cabin management
- **Features**: 
  - Dynamic cruise name filtering from backend
  - Real-time cabin status updates
  - Comprehensive search and filter options
  - Modal-based editing interface
  - Responsive data table

### OurDining.jsx
- **Purpose**: Customer-facing dining options
- **Features**:
  - Meal option browsing
  - Dynamic content loading
  - Responsive card layouts
  - Integration with backend meal data

## 🔒 Security Features

- **Input Validation** - Server-side validation for all inputs
- **SQL Injection Prevention** - Prepared statements and parameterized queries
- **CORS Configuration** - Proper cross-origin resource sharing setup
- **Authentication** - Session-based user authentication
- **Password Hashing** - Secure password storage
- **Email Verification** - Account verification via email

## 📱 Responsive Design

The application is built with mobile-first responsive design:
- **Bootstrap Grid System** - Flexible layout system
- **Responsive Tables** - Horizontal scrolling on mobile
- **Adaptive Navigation** - Collapsible navigation menus
- **Touch-Friendly UI** - Optimized for touch interfaces

## 🧪 Development Workflow

### Code Standards
- **ESLint Configuration** - JavaScript code linting
- **React Hooks** - Modern React patterns with hooks
- **Component Structure** - Modular and reusable components
- **API Integration** - Centralized API calling patterns

### Git Workflow
```bash
# Feature development
git checkout -b feature/new-feature
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# Create pull request for code review
```

## 🚀 Deployment

### Production Build
```bash
cd frontend/my-vue-app
npm run build
```

### Server Deployment
1. Upload backend files to web server
2. Upload built frontend files to web server
3. Configure database connection
4. Set up email services
5. Configure domain and SSL certificate

## 🐛 Troubleshooting

### Common Issues

#### CORS Errors
Ensure backend PHP files include proper CORS headers:
```php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
```

#### Database Connection Issues
- Verify MySQL service is running
- Check database credentials in `DbConnector.php`
- Ensure database exists and tables are created

#### Email Not Sending
- Verify SMTP configuration in `Mailer.php`
- Check firewall settings
- Validate email credentials

## 📈 Future Enhancements

- **Payment Integration** - Online payment processing
- **Real-time Notifications** - WebSocket-based notifications
- **Mobile App** - React Native mobile application
- **Advanced Reporting** - Analytics and reporting dashboard
- **Multi-language Support** - Internationalization
- **API Documentation** - Swagger/OpenAPI documentation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Serendip Waves** - Sail into the future of cruise management! 🚢⚓



