import { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

function NewPractice({ practices, setPractices }) {
    const [practice, setPractice] = useState({});

    const addPractice = () => {
        if (practice.song.length === 0 || practice.reviewer.length === 0 || practice.review.length === 0) {
            setInfo('Kenttä tyhjä. Ei voida lisätä arvostelua');
        } else {
            const newPractice = { song: practice.song, artist: practice.artist, reviewer: practice.reviewer, review: practice.review };
            setPractices([...practices, newPractice]);
            setPractice({ song: '', artist: '', reviewer: '', review: '' });
            setInfo('Uusi arvostelu lisättiin');
        }
    }

    const handleChange = (e) => {
        setPractice({ ...practice, [e.target.name]: e.target.value });
        setInfo('');
    }

    return (
        <Box>
            <TextField
                fullWidth
                label="Kappale"
                name="song"
                value={practice.song}
                onChange={(e) => handleChange(e)}
                style={{ marginBottom: 10 }}
            />
            <TextField
                fullWidth
                label="Artisti"
                name="artist"
                value={practice.artist}
                onChange={(e) => handleChange(e)}
                style={{ marginBottom: 10 }}
            />
            <TextField
                fullWidth
                label="Arvostelija"
                name="reviewer"
                value={practice.reviewer}
                onChange={(e) => handleChange(e)}
                style={{ marginBottom: 10 }}
            />
            <TextField
                fullWidth
                multiline
                label="Arvostelu"
                name="review"
                value={practice.review}
                onChange={(e) => handleChange(e)}
                style={{ marginBottom: 10 }}
            />
            <Button variant="contained" onClick={addPractice} style={{ marginBottom: 10 }}>Lisää arvostelu</Button>
            <p style={{ color: 'red' }}>{info}</p>
        </Box>
    );
}

export default NewPractice;