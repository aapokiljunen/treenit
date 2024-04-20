import { createTheme } from '@mui/material';
import { blueGrey } from '@mui/material/colors';


const theme = createTheme({
    palette: {
        primary: {
            main: blueGrey[500],
            contrastText: '#FFFFFF'
        },
        secondary: {
            main: blueGrey[800],
            contrastText: '#FFFFFF'
        },
        text: {
            primary: blueGrey[800]
        },
    },
    typography: {
        fontFamily: "'Figtree'",
    }
});

export default theme