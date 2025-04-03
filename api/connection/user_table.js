const pool = require('./pool');

/*
================================================
START OF USER FUNCTIONS
================================================
*/
async function getUserByEmail(Email) {
    const [result] = await pool.query(`SELECT * FROM users WHERE Email = ?`, [Email]);
    return result[0];
}

async function getUsers() {
    const [result] = await pool.query('SELECT * FROM users');
    return result;
}

async function getUser(User_ID) {
    const [result] = await pool.query(`SELECT * FROM users WHERE User_ID = ?`, [User_ID]);
    return result[0];
}

async function createUser(User_ID, Email, Password, Authentication_status, Avatar, Ingame_name, in_game_currency, owned_item, OTP_Verification_Status, Created_At) {
    const [result] = await pool.query(
        'INSERT INTO users (User_ID, Email, Password, Authentication_status, Avatar, Ingame_name, in_game_currency, owned_item, OTP_Verification_Status, Created_At) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [User_ID, Email, Password, Authentication_status, Avatar, Ingame_name, in_game_currency, owned_item, OTP_Verification_Status, Created_At]
    );
    const id = result.insertId;
    return getUser(id);
}

async function updateUser(User_ID, Email, Password, Authentication_status, Avatar, Ingame_name, in_game_currency, owned_item, OTP_Verification_Status,) {
    const [result] = await pool.query(
        'UPDATE users SET Email = ?, Password = ?, Authentication_status = ?, Avatar = ?, Ingame_name = ?, in_game_currency = ?, owned_item = ?, OTP_Verification_Status = ? WHERE User_ID = ?',
        [Email, Password, Authentication_status, Avatar, Ingame_name, in_game_currency, owned_item, OTP_Verification_Status, User_ID]
    );
    return getUser(User_ID);
}

async function deleteUser(User_ID) {
    const [result] = await pool.query('DELETE FROM users WHERE User_ID = ?', [User_ID]);
    return result;
}


/*
================================================
END OF USER FUNCTIONS
================================================
*/

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getUserByEmail,
};
