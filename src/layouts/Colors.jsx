import { amber, deepOrange, grey, orange, red, yellow } from "@mui/material/colors";

const typeColors = {
    1: deepOrange,
    2: red,
    3: orange,
    4: amber,
    5: yellow,
    'done': grey,
};

export function getTypeColor(typeId) {
    return typeColors[typeId] || 'grey';
};