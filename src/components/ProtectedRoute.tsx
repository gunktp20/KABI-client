import { ReactElement } from 'react';
import { useAppSelector } from '../app/hook'
import { Navigate } from 'react-router-dom';

interface IProtectedRoute {
    children: ReactElement
}
function ProtectedRoute({ children }: IProtectedRoute) {
    const { token } = useAppSelector((state) => state.auth)
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

export default ProtectedRoute
