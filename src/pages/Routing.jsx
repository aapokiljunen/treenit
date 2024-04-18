import { Link, createBrowserRouter, isRouteErrorResponse, useRouteError } from 'react-router-dom';
import Navigation from '../layouts/Navigation';
import PracticeList from '../components/PracticeList';
import NewPractice from '../components/NewPractice';
import { Box } from '@mui/material';

const HandleError = () => {
    const error = useRouteError();
    if (isRouteErrorResponse(error)) {
        return (
            <Box>
                {error.status} {error.data}
                <Link to="/">Palaa</Link>
            </Box>);
    }
    return (
        <Box>
            {error.message} {error.data}
            <Link to="/">Palaa</Link>
        </Box>);
}

const router = createBrowserRouter([
    {
        element: <Navigation />,
        errorElement: <HandleError />,
        children: [
            {
                path: '/',
                element: <PracticeList />
            },
            {
                path: "newpractice",
                element: <NewPractice />
            },
        ],
    },
]);


export default router