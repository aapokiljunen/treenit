import { blueGrey, lightBlue, orange, red, yellow } from "@mui/material/colors";

const typeColors = {
    1: lightBlue,
    2: red,
    3: blueGrey,
    4: yellow,
    5: orange,
    'done': 'secondary.main',
};

export function getTypeColor(type) {
    return typeColors[type] || 'secondary';
};