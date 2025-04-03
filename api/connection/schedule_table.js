const pool = require('./pool');

/*
================================================
START OF SCHEDULE FUNCTIONS
================================================
*/

async function getScheds() {
    const [result] = await pool.query('SELECT * FROM schedule');
    return result;
}

async function getSched(Schedule_ID) {
    const [result] = await pool.query(`SELECT * FROM schedule WHERE Schedule_ID = ?`, [Schedule_ID]);
    return result[0];
}

async function createSchedule(Title, Event_Type, Description, Date, Start_time, End_time, Location) {
    const [result] = await pool.query(
        'INSERT INTO schedule (Title, Event_Type, Description, Date, Start_time, End_time, Location) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [Title, Event_Type, Description, Date, Start_time, End_time, Location]
    );

    const id = result.insertId;
    return getSched(id);  // Fetch and return the newly created schedule using the generated ID
}


async function updateSchedule(Schedule_ID, Title, Event_Type, Description, Date, Start_time, End_time, Location) {
    const [result] = await pool.query(
        `UPDATE schedule 
         SET Title = ?, Event_Type = ?, Description = ?, Date = ?, Start_time = ?, End_time = ?, Location = ?
         WHERE Schedule_ID = ?`,
        [Title, Event_Type, Description, Date, Start_time, End_time, Location, Schedule_ID]
    );

    return getSched(Schedule_ID);
}


async function deleteSchedule(Schedule_ID) {
    // Delete the user from the database using the provided Schedule_ID
    const [result] = await pool.query('DELETE FROM schedule WHERE Schedule_ID = ?', [Schedule_ID]);
    return result;
}


/*
================================================
END OF USER FUNCTIONS
================================================
*/

module.exports = {
    getSched,
    getScheds,
    createSchedule,
    updateSchedule,
    deleteSchedule,
};
