import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login, Register, Dashboard, HomeLayout } from "./Pages/index.js";
import { loader as userLoader } from "./Pages/Dashboard.jsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout/>,
    children: [
      {
        index: true,
        element: <Dashboard/>,
        loader: userLoader
      },
      {
        path: 'login',
        element: <Login/>
      },
      {
        path: 'register',
        element: <Register/>
      },
    ]
  }
]);

const App = () => {
  return (
    <RouterProvider router={router}/>
  )
}
export default App