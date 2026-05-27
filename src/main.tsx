import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import Home from './app/home/Home.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { Art } from './app/art/Art.tsx';
import ArtWave from './app/art-2/ArtWave.tsx';


const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/art', element: <Art /> },
            { path: '/art-2', element: <ArtWave /> },
        ],
    },
]);

createRoot(document.getElementById('root')!).render(
        <RouterProvider router={router} />
);
