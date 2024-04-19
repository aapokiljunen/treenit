import { cyan, green, lightGreen, lime, red, teal, yellow } from "@mui/material/colors";

const typeColors = {
    1: teal,
    2: red,
    3: lightGreen,
    4: lime,
    5: yellow,
    'done': 'secondary',
};

export function getTypeColor(typeId) {
    return typeColors[typeId] || 'secondary';
};