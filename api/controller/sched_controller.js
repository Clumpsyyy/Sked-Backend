const { getSched, getScheds, createSchedule, updateSchedule, deleteSchedule} = require('../connection/schedule_table.js');

const express = require('express');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/authMiddleware.js')
const router = express.Router();

router.use(express.json());

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// GET ALL sched
router.get('/', verifyToken, async (req, res) => { 
    const users = await getScheds();
    res.send(users);
});

// GET SINGLE sched
router.get('/:id', verifyToken, async (req, res) => { 
    const id = req.params.id;
    const schedule = await getSched(id);
    if (!schedule) {
        return res.status(404).json({ error: 'schedule not found' });
    }
    res.send(schedule);
});

// CREATE A NEW Schedule
router.post('/', async (req, res) => {
    const { Title, Event_Type, Description, Date, Start_time, End_time, Location } = req.body;
    const schedule = await createSchedule( Title, Event_Type, Description, Date, Start_time, End_time, Location);
    res.send(schedule);
});

// UPDATE AN EXISTING Schedule
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { Title, Event_Type, Description, Date, Start_time, End_time, Location } = req.body;
    const schedule = await updateSchedule(id, Title, Event_Type, Description, Date, Start_time, End_time, Location);
    res.send(schedule);
});


// DELETE A schedule
router.delete('/:id', verifyToken, async (req, res) => { 
    const id = req.params.id;
    await deleteSchedule(id);
    res.send('Schedule successfully deleted');
});


module.exports = router