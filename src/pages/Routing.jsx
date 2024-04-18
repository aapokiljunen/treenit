import { Link, createBrowserRouter, isRouteErrorResponse, useRouteError } from 'react-router-dom';
import Navigation from '../layouts/Navigation';
import PracticeList from '../components/PracticeList';
import NewPractice from '../components/NewPractice';

const handleError = () => {
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
        errorElement: <handleError />,
        children: [
            {
                path: '/',
                element: <PracticeList />
            },
            {
                path: "newPractice",
                element: <NewPractice />
            },
        ],
    },
]);


export default router