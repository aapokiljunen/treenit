import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { RouterProvider } from 'react-router-dom';
import router from './pages/Routing';
import theme from './layouts/Theme';
import { PracticesProvider } from './components/contexts/PracticesContext';
import { PracticeCalendarProvider } from './components/contexts/PracticeCalendarContext';
import { LocationsProvider } from './components/contexts/LocationsContext';
import { ClickMarkerProvider } from './components/contexts/ClickMarkerContext';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <LocationsProvider>
                <PracticesProvider>
                    <PracticeCalendarProvider>
                        <ClickMarkerProvider>
                            <CssBaseline />
                            <RouterProvider router={router} />
                        </ClickMarkerProvider>
                    </PracticeCalendarProvider>
                </PracticesProvider>
            </LocationsProvider>
        </ThemeProvider>
    )
}

export default App
