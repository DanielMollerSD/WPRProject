// src/pages/register

import React, { useState } from 'react';
import { register } from '../../api/api.js';

import './styles.scss';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await register({ email, password }); // Call the `register` function
            alert(response.data);
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="email" 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email" 
                value={email} 
                required 
            />
            <input 
                type="password" 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
                value={password} 
                required 
            />
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
