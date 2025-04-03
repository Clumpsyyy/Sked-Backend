const express = require('express');
const cors = require('cors');
const app = express();
const pool = require('./api/connection/pool');
const verifyToken = require('./api/middleware/authMiddleware');
const dotenv = require('dotenv');

dotenv.config();


//middleware
app.use(cors());
app.use(express.json())

 
// All controllers
const userController = require('./api/controller/user_controller');
const scheduleController = require('./api/controller/sched_controller')
const authController = require('./api/controller/auth_controller');

app.use('/api/users', userController);
app.use('/api/auth', authController);
app.use('/api/schedule', scheduleController);

app.get('/', (req, res) => {
    res.send('The app is up and running.')
});

const PORT = 3000;

//awfsfs
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const shutdown = () => {
    console.log('Shutting down server...');
    server.close(() => {
        console.log('Server closed.');
        pool.end(() => {
            console.log('Database connection pool closed.');
            process.exit(0);
        });
    });
};

async function testConnection() {
    try {
      const connection = await pool.getConnection();
      console.log('Database connection successful');
      connection.release();
    } catch (error) {
      console.error('Database connection failed:', error);
    }
  }
 
testConnection();

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
