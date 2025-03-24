import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {login} from './api';

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate()


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {

            const response = await login(email, password);
            if (response.token) {
                localStorage.setItem('token', response.token);
                navigate('/users');
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            // Проверяем, является ли ошибка объектом и имеет ли свойство response
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as { response: { data: { message: string } } };
                setError(axiosError.response?.data?.message || 'Login failed');
            } else {
                setError('Login failed');
            }
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center">Sign In</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Sign In</button>
                            </form>
                            <div className="mt-3 text-center">
                                <p>Don't have an account? <a href="/register">Sign up</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;