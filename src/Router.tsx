import Home from '@/pages/home';
import { createHashRouter, RouterProvider } from 'react-router-dom';

const routers = createHashRouter([{ path: '/', element: <Home /> }]);

const Router = () => {
  return <RouterProvider router={routers} />;
};

export default Router;
