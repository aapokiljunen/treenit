const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('practice.db');

db.serialize(() => {

    db.run(`CREATE TABLE IF NOT EXISTS location (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS practicetype (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS practice (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date DATE NOT NULL,
        description TEXT,
        notes TEXT,
        image TEXT,
        done INT NOT NULL,
        location_id INTEGER NOT NULL,
        practicetype_id INTEGER NOT NULL,
        FOREIGN KEY (location_id) REFERENCES location(id),
        FOREIGN KEY (practicetype_id) REFERENCES practicetype(id) 
    )`);

    // Insert locations
    db.run(`INSERT INTO location (name, latitude, longitude) VALUES
        ('Töölön pallokenttä', 60.1874, 24.9164),
        ('Brahen kenttä', 60.1926, 24.9309),
        ('Töölönlahti', 60.1816, 24.9160),
        ('Eläintarhan kenttä', 60.1869, 24.9401),
        ('Urheilutalo', 60.1913, 24.9216),
        ('Puotilan kenttä', 60.1772, 25.0254)
    `);

    db.run(`INSERT INTO practicetype (name) VALUES
        ('Joukkueharjoitus'),
        ('Ottelu'),
        ('Tekniikkaharjoitus'),
        ('Punttisali'),
        ('Juoksuharjoitus')`);

    // Insert practices
    const startDate = '2024-03-01';
    const endDate = '2024-10-10';

    const practiceTypes = ['Joukkueharjoitus', 'Ottelu', 'Tekniikkaharjoitus', 'Punttisali', 'Juoksuharjoitus'];
    const descriptions = [
        "juoksutreenit", "vapaamuotoista treeniä", "tekniikkaharjoituksia", 
        "kovaa treeniä", "leppoisaa harjoittelua", "intensiiviset treenit"
    ];

    // Generate 25 random events
    for (let i = 0; i < 25; i++) {
        const practiceDate = randomDate(startDate, endDate);
        const practiceType = practiceTypes[Math.floor(Math.random() * practiceTypes.length)];
        let locationID;
        let description = null;

        switch (practiceType) {
            case 'Joukkueharjoitus':
            case 'Tekniikkaharjoitus':
            case 'Juoksuharjoitus':
                locationID = Math.floor(Math.random() * 4) + 1; // Random outdoor location between 1-4
                break;
            case 'Ottelu':
                locationID = Math.floor(Math.random() * 3) + 1; // Random outdoor location between 1-3
                description = `vs ${generateOpponent()}`;
                break;
            case 'Punttisali':
                locationID = 5; // Urheilutalo
                break;
        }

        // Add random descriptions to some practices
        if (!description && Math.random() < 0.5) {
            description = descriptions[Math.floor(Math.random() * descriptions.length)];
        }

        db.run(`INSERT INTO practice (date, description, done, location_id, practicetype_id) VALUES (?, ?, ?, ?, (SELECT id FROM practicetype WHERE name = ?))`, [practiceDate, description, 0, locationID, practiceType]);
    }

    // Insert weekly team practice on Sundays
    let currentDate = new Date(startDate);
    const endDateObj = new Date(endDate);

    while (currentDate <= endDateObj) {
        if (currentDate.getDay() === 0) { // 0 corresponds to Sunday
            const practiceDate = currentDate.toISOString().split('T')[0];
            db.run(`INSERT INTO practice (date, description, done, location_id, practicetype_id) VALUES (?, ?, ?, ?, (SELECT id FROM practicetype WHERE name = 'Joukkueharjoitus'))`, [practiceDate, 'Weekly team practice', 0, 1]);
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    db.serialize(() => {
        // Set images for 5 different practices
        const practiceImages = ['soc1.jpg', 'soc2.jpg', 'soc3.jpg', 'soc4.jpg', 'soc5.jpg'];
        db.all(`SELECT id FROM practice LIMIT 5`, [], (err, rows) => {
            if (err) {
                return console.error(err.message);
            }
            rows.forEach((row, index) => {
                db.run(`UPDATE practice SET image = ? WHERE id = ?`, [practiceImages[index], row.id]);
            });
        });

        // Set image for weekly team practice
        db.run(`UPDATE practice SET image = 'taktiikat.jpg' WHERE description = 'Weekly team practice'`);
    });

    // Generate a random date within the given range
    function randomDate(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
    }

    // Generate a random opponent for match events
    function generateOpponent() {
        const opponents = ['HJK', 'FC Honka', 'PK-35', 'FC Inter', 'FC Lahti', 'RoPS', 'FC Ilves', 'KTP'];
        return opponents[Math.floor(Math.random() * opponents.length)];
    }

    db.each("SELECT * FROM practice", function (err, row) {
        if (err) {
            return console.log(err.message);
        }
        console.log(row.id + ", " + row.date + ", " + row.description + ", " + row.image);
    });

    db.close();
});