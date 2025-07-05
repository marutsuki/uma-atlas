import { paths } from '@/config/path';
import { useMemo } from 'react';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import LoginPage from './login';
import RegisterPage from './register';

export const createAppRouter = () =>
    createBrowserRouter([
        {
            path: paths.auth.register.path,
            element: < RegisterPage />
        },
        {
            path: paths.auth.login.path,
            element: <LoginPage />
        },
        {
            path: paths.app.root.path,
            element: <div>Landing page</div>
        }
    ]);

export const AppRouter = () => {
    const router = useMemo(() => createAppRouter(), []);

    return <RouterProvider router={router} />;
};