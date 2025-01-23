import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';  
import axios from "axios";

import "./styles.scss";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null); 
    const navigate = useNavigate(); 

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_APP_API_URL}/Login`,
                {
                    email,
                    password,
                },
                { withCredentials: true }
            );

            if (response.status === 200) {
                const { token } = response.data;
                localStorage.setItem("access_token", token);
                navigate('/vehicle-overview');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.Message || "Login failed. Please try again.");
            } else {
                console.error("Error during login:", error);
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <>
            <div className="page page-login">
                <div id="LoginBody">
                    <main id="LoginMain">
                        <section className="login-container">
                            <h2>Inloggen</h2>
                            <form onSubmit={handleLogin}>
                                <div className="form-group">
                                    <label htmlFor="email" id="LoginLabel">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Voer uw email in"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="LoginInput"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password" id="LoginLabel">
                                        Wachtwoord
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        placeholder="Voer uw wachtwoord in"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="LoginInput"
                                    />
                                </div>

                                <button id="LoginButton" type="submit" className="btn">
                                    Inloggen
                                </button>

                                {error && <p className="error-message">{error}</p>}

                                <p className="signup-link">
                                    Geen account? <a href="/signup-select">Registreren</a>
                                </p>
                            </form>
                        </section>
                    </main>
                    <div className="bgImgLogin"></div>
                </div>
            </div>
        </>
    );
}

export default Login;