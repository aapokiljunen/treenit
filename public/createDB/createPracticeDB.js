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
        done INT NOT NULL,
        location_id INTEGER NOT NULL,
        practicetype_id INTEGER NOT NULL,
        FOREIGN KEY (location_id) REFERENCES location(id),
        FOREIGN KEY (practicetype_id) REFERENCES practicetype(id) 
    )`);

    // Sijaintien lisäys
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

    // Tapahtumien lisäys
    const startDate = '2024-03-01';
    const endDate = '2024-10-10';

    const practiceTypes = ['Joukkueharjoitus', 'Ottelu', 'Tekniikkaharjoitus', 'Punttisali', 'Juoksuharjoitus'];

    // Generoidaan 25 tapahtumaa
    for (let i = 0; i < 25; i++) {
        const practiceDate = randomDate(startDate, endDate);
        const practiceType = practiceTypes[Math.floor(Math.random() * practiceTypes.length)];
        let locationID;

        switch (practiceType) {
            case 'Joukkueharjoitus':
            case 'Tekniikkaharjoitus':
            case 'Juoksuharjoitus':
                // Valitaan satunnainen ulkona oleva sijainti
                locationID = Math.floor(Math.random() * 4) + 1; // Arvotaan sijainti-id välillä 1-4
                break;
            case 'Ottelu':
                // Valitaan satunnainen ulkona oleva sijainti, jossa voi pelata otteluita
                locationID = Math.floor(Math.random() * 3) + 1; // Arvotaan sijainti-id välillä 1-3
                break;
            case 'Punttisali':
                // Valitaan sisätiloissa oleva sijainti
                locationID = 5; // Urheilutalo
                break;
        }

        const description = practiceType === 'Ottelu' ? `vs ${generateOpponent()}` : null;

        db.run(`INSERT INTO practice (date, description, done, location_id, practicetype_id) VALUES (?, ?, ?, ?, (SELECT id FROM practicetype WHERE name = ?))`, [practiceDate, description, 0, locationID, practiceType]);
    }

    // Satunnaisen päivämäärän generointi annetun aikavälin sisällä
    function randomDate(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
    }

    // Satunnaisen vastustajan generointi ottelutapahtumille
    function generateOpponent() {
        const opponents = ['HJK', 'FC Honka', 'IFK Helsinki', 'PK-35', 'FC Inter', 'FC Lahti', 'RoPS', 'FC Ilves', 'KTP'];
        return opponents[Math.floor(Math.random() * opponents.length)];
    }
    db.each("SELECT * FROM practice", function (err, row) {
        if (err) {
            return console.log(err.message);
        }
        console.log(row.id + ", " + row.otsikko);
    });


    db.close();
});
