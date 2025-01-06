import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';  

import "./styles.scss";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null); 
    const navigate = useNavigate(); 

    const handleLogin = async (event) => {
        event.preventDefault(); 

        const response = await fetch("https://localhost:7265/api/Customer/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
            credentials: "include",  // Include credentials like cookies for the token
        });

        if (response.ok) {
            try {
                const data = await response.json();
                console.log("Logged in successfully:", data);
                // Save the token or do any further processing
                localStorage.setItem("access_token", data.Token); // Example, if you want to save the token
                navigate('/vehicle-overview');  
            } catch (error) {
                console.error("Error parsing the response JSON", error);
                setError("Something went wrong while processing the login.");
            }
        } else {
            try {
                const errorData = await response.json();
                setError(errorData.Message || "Login failed. Please try again.");
            } catch (error) {
                console.error("Error parsing the error response JSON", error);
                setError("Login failed. Please try again.");
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
