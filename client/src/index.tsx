import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { Main } from "./pages/main";
import { Root } from "./components/Root";
import { Register } from "./pages/register";
import { Auth } from "./pages/auth";
import { Room } from "./pages/room";
import { store } from "./store/store";
import { theme } from "./theme/theme"

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        children: [
            {
              index: true,
              element: <Main/>
            },
            {
                path: "/register",
                element: <Register/>
            },
            {
                path: "/login",
                element: <Auth/>
            },
            {
                path: "/profile",
                element: <Main/>
            },
            {
                path: "/room",
                element: <Room/>
            }
        ]
    },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <ReduxProvider store={store}>
          <ThemeProvider theme={theme}>
              <RouterProvider router={router} />
          </ThemeProvider>
      </ReduxProvider>
  </React.StrictMode>
);

reportWebVitals();
