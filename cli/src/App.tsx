import React, {useEffect} from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes, useNavigate} from 'react-router-dom';
import UserTable from './components/UserTable';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
    return (
        <Router>
            <AppContent/>
        </Router>
    );
};

const AppContent: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/users');
        }
    }, [navigate]);

    return (
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route element={<ProtectedRoute/>}>
                <Route path="/users" element={<UserTable/>}/>
            </Route>
            <Route path="/" element={<Navigate to="/login"/>}/>
        </Routes>
    );
};

export default App;