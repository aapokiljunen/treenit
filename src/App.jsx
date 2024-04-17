import CssBaseline from '@mui/material/CssBaseline';
import { lightBlue } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Navigation from './layouts/Navigation'
import NewPractice from './components/NewPractice';
import PracticeList from './components/PracticeList';
import { Typography } from '@mui/material';


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

const router = createBrowserRouter([
    {
        element: <Navigation />,
        errorElement: <><Navigation /><Typography>Not found</Typography></>,
        children: [
            {
                path: '/',
                element: <PracticeList/>
            },
            {
                path: "newPractice",
                element: <NewPractice />
            },
        ],
    },
]);

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <RouterProvider router={router} />
        </ThemeProvider>
    )
}

export default App
