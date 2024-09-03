import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import { PrivateRoute } from "./components/PrivateRoute";
import UserProfile from "./components/UserProfile";

const AppRoutes = [
    {
        path: '/',
        element: <PrivateRoute element={Home} />,
    },
    {
    path: '/login',
    element: <LoginPage />
    },
    {
        path: '/register',
        element: <RegisterPage />
    },
    {
        path: '/profile/:username',
        element: <PrivateRoute element={UserProfile} />
    },
    {
        path: '/fetch-data',
        element: <PrivateRoute element={FetchData} />
    }
];

export default AppRoutes;
