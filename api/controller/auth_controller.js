const express = require('express');
const jwt = require('jsonwebtoken');
const { getUserByEmail, createUser } = require('../database_connection/user_table.js');
const router = express.Router();

router.use(express.json());

// USER SIGNUP
router.post('/signup', async (req, res) => {
    try {
        const { Email, Password } = req.body;
        const existingUser = await getUserByEmail(Email);
        if (existingUser) {
            return res.status(400).send({
                error: 'Email is already in use'
            });
        }
        const user = await createUser(null, Email, Password, 'pending', null, null, 0, null, 'unverified', new Date());

        res.send({ message: 'User created successfully. Please log in.' }); 

    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// USER LOGIN
router.post('/login', async (req, res) => {
    const { Email, Password } = req.body;
    const user = await getUserByEmail(Email);
    if (!user || user.Password !== Password) {
        return res.status(401).send({
            error: 'Invalid email or password'
        });
    }
    const token = jwt.sign({
        User_ID: user.User_ID,
        Email: user.Email
    },
    process.env.JWT_SECRET, { expiresIn: '1h' }); 
    
    res.send({ token, User_ID: user.User_ID, Ingame_name: user.Ingame_name });
   
    
});

module.exports = router;