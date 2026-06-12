import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import Home from './app/home/Home.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { Art } from './app/art/Art.tsx';
import ArtParent from './components/pages/art-dark/ArtParent.tsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/art', element: <Art /> },
            { path: '/art-dark', element: <ArtParent /> },
        ],
    },
]);

createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
