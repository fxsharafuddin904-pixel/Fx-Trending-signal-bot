const fs = require("fs");

const DB_FILE = "./database.json";

// Database তৈরি
function loadDatabase() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({
            users: {}
        }, null, 2));
    }

    return JSON.parse(fs.readFileSync(DB_FILE));
}

// Save Database
function saveDatabase(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// User Create
function getUser(id) {

    const db = loadDatabase();

    if (!db.users[id]) {

        db.users[id] = {

            timeframe: 1,
            market: null,
            step: "idle"

        };

        saveDatabase(db);

    }

    return db.users[id];

}

// Update User
function updateUser(id, data) {

    const db = loadDatabase();

    db.users[id] = {

        ...getUser(id),
        ...data

    };

    saveDatabase(db);

}

// Get All
function getDatabase() {
    return loadDatabase();
}

module.exports = {

    getUser,
    updateUser,
    getDatabase

};
