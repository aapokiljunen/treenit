import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { RouterProvider } from 'react-router-dom';
import router from './pages/Routing';
import theme from './layouts/Theme';
import { PracticesProvider } from './components/contexts/PracticesContext';
import { PracticeCalendarProvider } from './components/contexts/PracticeCalendarContext';
import { LocationsProvider } from './components/contexts/LocationsContext';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <LocationsProvider>
                <PracticesProvider>
                    <PracticeCalendarProvider>
                        <CssBaseline />
                        <RouterProvider router={router} />
                    </PracticeCalendarProvider>
                </PracticesProvider>
            </LocationsProvider>
        </ThemeProvider>
    )
}

export default App
