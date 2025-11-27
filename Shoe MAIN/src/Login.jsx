import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/login.css';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';

function Login() {
    const { user, login } = useUser();
    const navigate = useNavigate();

    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const toggleForm = () => {
        setIsSignUp(!isSignUp);
        resetForm();
    };

    const resetForm = () => {
        setEmail('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isSignUp) {
                if (password !== confirmPassword) {
                    setError('Passwords do not match');
                    return;
                }

                await axios.post('http://localhost:9000/signup', {
                    email: email.trim(),
                    username: username.trim(),
                    password: password.trim()
                });

                alert('Signup successful! Please sign in.');
                toggleForm();
            } else {
                const response = await axios.post('http://localhost:9000/login', {
                    email: email.trim(),
                    password: password.trim()
                });

                localStorage.setItem('token', response.data.token || 'dummy-token'); // Optional: add token later
                login({ email }); // You can extend this later with full user info
            }
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data || 'An error occurred');
        }
    };

    if (user) return null;

    return (
        <div className="login-container">
            {error && <p className="error">{error}</p>}

            {isSignUp ? (
                <div className="signup-form">
                    <h2>Sign Up</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            required
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="email"
                            required
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            required
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            required
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button type="submit" id="t1">Sign Up</button>
                    </form>
                    <p>Already have an account? <button onClick={toggleForm} id="t2">Sign In</button></p>
                </div>
            ) : (
                <div className="signin-form">
                    <h2>Sign In</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            required
                            placeholder="Email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setUsername('');
                            }}
                        />
                        <input
                            type="password"
                            required
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" id="t1">Sign In</button>
                    </form>
                    <p>Don't have an account? <button onClick={toggleForm} id="t2">Sign Up</button></p>
                </div>
            )}
        </div>
    );
}

export default Login;
