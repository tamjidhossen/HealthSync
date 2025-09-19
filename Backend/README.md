# HealthSync Backend API

## 🏥 Overview
This is the backend API server for HealthSync - a comprehensive healthcare management system that connects patients, doctors, and administrators through intelligent features including AI-powered medical assistance, telemedicine, and streamlined appointment management.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16.0.0 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env file
   ```

5. **Run the application**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Verify setup**
   - Health check: http://localhost:5000/health
   - API docs: http://localhost:5000/api/v1/docs

## 📁 Project Structure

```
src/
├── controllers/     # Request handlers and business logic
├── models/         # MongoDB/Mongoose data models
├── routes/         # API route definitions
├── middleware/     # Custom middleware functions
├── services/       # External service integrations
├── utils/          # Utility functions and helpers
├── config/         # Configuration files
└── sockets/        # WebSocket handlers for real-time features
```

## 🔧 Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run test suite
npm run test:coverage  # Run tests with coverage report
npm run seed       # Seed database with sample data
npm run create-admin   # Create initial admin user
npm run clear-db   # Clear database (development only)
```

## 🌐 API Endpoints

### Base URL: `/api/v1`

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/health` | GET | Server health check |
| `/api/v1/` | GET | API welcome message |
| `/api/v1/docs` | GET | API documentation |
| `/api/v1/status` | GET | API status check |

*Additional endpoints will be available after Phase 2 implementation*

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Joi schema validation
- **SQL Injection Protection**: MongoDB sanitization
- **XSS Protection**: Input sanitization
- **CORS Configuration**: Controlled cross-origin requests
- **Helmet Security**: Security headers
- **HPP Protection**: HTTP Parameter Pollution prevention

## 📊 Logging

The application uses Winston for structured logging:
- **Console**: Colored output for development
- **Files**: `logs/error.log` and `logs/combined.log`
- **Levels**: error, warn, info, http, debug

## 🔧 Environment Variables

Key environment variables (see `.env.example` for complete list):

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/healthsync-dev
JWT_SECRET=your-secret-key
EMAIL_USERNAME=your-email@gmail.com
OPENAI_API_KEY=your-openai-key
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📦 Dependencies

### Production Dependencies
- **express**: Web application framework
- **mongoose**: MongoDB object modeling
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT implementation
- **joi**: Schema validation
- **winston**: Logging library
- **helmet**: Security middleware
- **cors**: Cross-origin resource sharing

### Development Dependencies
- **nodemon**: Auto-restart development server
- **jest**: Testing framework
- **supertest**: HTTP testing
- **eslint**: Code linting
- **prettier**: Code formatting

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Using PM2 (recommended for production)
```bash
npm install -g pm2
pm2 start server.js --name "healthsync-api"
pm2 startup
pm2 save
```

## 🐳 Docker Support
*(To be added in future versions)*

## 📈 Performance Optimization

- **Compression**: Gzip compression enabled
- **Caching**: Redis integration ready
- **Connection Pooling**: MongoDB connection optimization
- **Rate Limiting**: API request throttling
- **Error Handling**: Graceful error recovery

## 🔄 Development Phases

### ✅ Phase 1: Core Setup (Current)
- Basic server setup with Express
- Database connection with MongoDB
- Logging and error handling
- Security middleware
- Project structure

### 🔜 Phase 2: Authentication System
- User models (Doctor, Patient, Admin)
- JWT authentication
- Email verification
- Role-based authorization

### 🔜 Phase 3: Core APIs
- Doctor registration and management
- Patient registration and management
- Admin verification system
- Appointment booking system

### 🔜 Phase 4: Medical Features
- Prescription management
- Medical records system
- AI integration
- Doctor-patient matching

### 🔜 Phase 5: Real-time Features
- Telemedicine chat system
- WebSocket integration
- Real-time notifications

### 🔜 Phase 6: Advanced Features
- AI-powered recommendations
- File upload handling
- Analytics and reporting
- Performance optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation at `/api/v1/docs`

---

**HealthSync Backend** - Building the future of digital healthcare 🏥✨
