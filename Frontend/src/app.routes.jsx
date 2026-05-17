import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import ProtectedLayout from "./features/auth/components/ProtectedLayout";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import Profile from "./features/profile/pages/Profile";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/",
        element: <Protected><ProtectedLayout /></Protected>,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "profile",
                element: <Profile />
            },
            {
                path: "interview/:interviewId",
                element: <Interview />
            }
        ]
    }
])