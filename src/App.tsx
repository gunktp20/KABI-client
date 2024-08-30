import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Login from "./page/Login"
import Register from "./page/Register"
import SendVerifyEmail from "./page/SendVerifyEmail"
import Unauthorized from "./page/Unauthorized"
import SessionExpired from "./page/SessionExpired"
import NotFound from "./page/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import Board from "./page/Board"
import Boards from "./page/Boards"
import CreateBoard from "./page/CreateBoard"
import { SocketProvider } from "./context/SocketContext"

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Boards />
      </ProtectedRoute>
    ),
  },
  {
    path: "board/:board_id",
    element: (
      <ProtectedRoute>
        <Board />
      </ProtectedRoute>
    ),
  },
  {
    path: "board/:board_id",
    element: (
      <ProtectedRoute>
        <Board />
      </ProtectedRoute>
    ),
  },
  {
    path: "create-board",
    element: (
      <ProtectedRoute>
        <CreateBoard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/session-expired",
    element: <SessionExpired />,
  },
  {
    path: "/request-verify-email/:token",
    element: <SendVerifyEmail />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
 
  return (
    <SocketProvider>
      <RouterProvider router={router} />
    </SocketProvider>
    
  )
}

export default App
