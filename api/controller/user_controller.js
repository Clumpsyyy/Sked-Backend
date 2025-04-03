const { getUsers, getUser, createUser, updateUser, deleteUser, getUserByEmail} = require('../database_connection/user_table.js');

const express = require('express');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/authMiddleware.js')
const router = express.Router();

router.use(express.json());

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// GET ALL USERS
router.get('/', verifyToken, async (req, res) => { 
    const users = await getUsers();
    res.send(users);
});

// GET SINGLE USER
router.get('/:id', verifyToken, async (req, res) => { 
    const id = req.params.id;
    const user = await getUser(id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.send(user);
});

// CREATE A NEW USER
router.post('/', async (req, res) => { 
    try {
        const { User_ID, Email, Password, Authentication_status, Avatar, Ingame_name, in_game_currency, owned_item, OTP_Verification_Status, Created_At } = req.body;
        const existingUser = await getUserByEmail(Email);
        if (existingUser) {
            return res.status(400).send({ error: 'Email is already in use' });
        }
        const user = await createUser(User_ID, Email, Password, Authentication_status, Avatar, Ingame_name, in_game_currency, owned_item, OTP_Verification_Status, Created_At);
        res.send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// UPDATE A USER
router.put('/:id', verifyToken, async (req, res) => { 
    const id = req.params.id;
    const { Email, Password, Authentication_status, Avatar, Ingame_name, in_game_currency, owned_item, OTP_Verification_Status } = req.body;

    console.log("Received ID:", id);
    console.log("Received Data:", req.body);

       try {
        const user = await updateUser(id, Email, Password, Authentication_status, Avatar, Ingame_name, in_game_currency, owned_item, OTP_Verification_Status);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        else {
        res.json({ message: "User updated successfully", user });
    }
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// DELETE A USER
router.delete('/:id', verifyToken, async (req, res) => { 
    const id = req.params.id;
    await deleteUser(id);
    res.send('User successfully deleted');
});


module.exports = router