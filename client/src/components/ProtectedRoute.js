import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext';

function ProtectedRoute({ children }) {
    const { isLoggedIn } = useUser();

    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
