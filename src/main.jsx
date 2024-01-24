import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import DevicesManager from './pages/DevicesManager.jsx';
import "leaflet/dist/leaflet.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "home",
    element: <Home/>
  },
  {
    path: "devices",
    element: <DevicesManager/>
  }
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
