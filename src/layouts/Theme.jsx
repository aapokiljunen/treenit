import { createTheme } from '@mui/material';
import { lightBlue } from '@mui/material/colors';


const theme = createTheme({
    palette: {
        primary: { main: lightBlue[500], contrastText: '#FFFFFF' },
        secondary: { main: lightBlue[800], contrastText: '#FFFFFF' },
        text: { primary: lightBlue[500] },
    },
    typography: {
        fontFamily: "'Figtree'",
    }
});

export default theme