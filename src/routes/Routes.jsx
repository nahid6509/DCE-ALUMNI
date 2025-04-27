import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../pages/Home";
import Train from "../pages/Train";
import Test from "../pages/Test";



const routes = createBrowserRouter([
    {
        path: "/",
        element: <Main></Main>,
        children: [
            {
                path: '/',
                element: <Home></Home>
            },
            {
                path: '/train',
                element: <Train />
            },
            {
                path: '/test',
                element: <Test/>
            }
            
        ]
    },
]);

export default routes;