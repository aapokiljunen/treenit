import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { RouterProvider } from 'react-router-dom';
import router from './pages/Routing';
import theme from './layouts/Theme';
import { PracticesProvider } from './components/PracticesContext';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <PracticesProvider>
                <CssBaseline />
                <RouterProvider router={router} />
            </PracticesProvider>
        </ThemeProvider>
    )
}

export default App
