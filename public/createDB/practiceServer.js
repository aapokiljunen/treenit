const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const sqlite3 = require('sqlite3').verbose();

app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(express.json());

const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './images')
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
});
const upload = multer({ storage: storage });

const db = new sqlite3.Database('practice.db');

app.get('/location/all', (req, res) => {
    db.all('SELECT * FROM location', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/location/add', (req, res) => {
    const tap = req.body;
    const sql = `INSERT INTO location (name, longitude, latitude) VALUES (?,?,?);`;
    params = [tap.name, tap.longitude, tap.latitude]
    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ count: this.changes });
    });
});

app.get('/practicetype/all', (req, res) => {
    db.all('SELECT * FROM practicetype', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});


app.get('/practice/all', (req, res) => {
    const sql = 'SELECT practice.id, practice.date, practice.description, practice.notes, practice.image, practice.done, practice.location_id AS locationId, practice.practicetype_id AS typeId, location.latitude AS locationLat, location.longitude AS locationLong, location.name AS location, practicetype.name AS typeName'
        + ' FROM practice'
        + ' JOIN location ON practice.location_id = location.id'
        + ' JOIN practicetype ON practice.practicetype_id = practicetype.id ORDER BY practice.date;';
    db.all(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/practice/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT practice.id, practice.date, practice.description, practice.notes, practice.image, practice.done, practice.location_id AS locationId, practice.practicetype_id AS typeId, location.latitude AS locationLat, location.longitude AS locationLong, location.name AS location, practicetype.name AS typeName'
        + ' FROM practice'
        + ' JOIN location ON practice.location_id = location.id'
        + ' JOIN practicetype ON practice.practicetype_id = practicetype.id WHERE practice.id = ?;';
    db.get(sql, [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(row);
    });
});

app.post('/practice/update', (req, res) => {
    const { columnName, newValue, id } = req.body;
    const sql = `UPDATE practice SET ${columnName} = ? WHERE id = ?;`;
    const params = [newValue, id];
    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ count: this.changes });
    });
});

app.post('/practice/add', (req, res) => {
    const tap = req.body;
    const sql = `INSERT INTO practice (date, description, notes, image, done, practicetype_id, location_id) VALUES (?,?,?,?,?,?,?);`;
    params = [tap.date, tap.description, tap.notes, tap.image, tap.done, tap.typeId, tap.locationId]
    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ count: this.changes });
    });
});

app.delete('/practice/delete/:id', (req, res) => {
    console.log(req.params.id);
    const id = Number(req.params.id);
    const sql = 'DELETE FROM practice WHERE id = ?'
    db.run(sql, [id], function (err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: `No practice with id ${id}` });
        }
        return res.status(200).json({ count: this.changes });
    });
});

const path = require('path');

app.use('/practice/images', express.static(path.join(__dirname, 'images')));

app.post('/practice/addImage', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(200).json({ fileName: req.file.originalname });
});

app.get('/practice/getImage/:name', (req, res) => {
    const fileName = req.params.name;
    const filePath = path.resolve(__dirname, 'images', fileName);
    res.sendFile(filePath);
});


// Start the server
app.listen(8081, () => {
    console.log('Localhost:8081');
});