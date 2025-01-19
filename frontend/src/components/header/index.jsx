import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import './styles.scss';

function Header() {
    const location = useLocation();
    const isHomepage = location.pathname === '/' || location.pathname === '/home';

    const token = localStorage.getItem("access_token");

    let userRole = "Unknown";
    let isLoggedIn = false;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            console.log("Decoded Token:", decoded);
            userRole = decoded["role"] || "Unknown";
            isLoggedIn = true;
        } catch (error) {
            console.error("Token decoding failed:", error);
        }
    }



    return (

        <div className="component component-header">
            <div className={`header${isHomepage ? ' homepage' : ''}`}>
                <div className="container">
                    <header>
                        <nav>
                            
                            <Link to="/">Home</Link>
                            
                            {!isLoggedIn && (
                                <>
                                    <Link to="/login">Login</Link>
                                    <Link to="/signup-select">Register</Link>
                                </>
                            )}

                            {isLoggedIn && userRole === "Individual" && (
                                <>
                                    <Link to="/vehicle-overview">Voertuigen</Link>
                                    <Link to="/account-settings">Profiel</Link>
                                </>
                            )}

                            {isLoggedIn && userRole === "Backoffice" && (
                                <>
                                    <Link to="#">Link toevoegen in /component/header</Link>
                                </>
                            )}

                            {isLoggedIn && userRole === "Frontoffice" && (
                                <>
                                    <Link to="#">Link toevoegen in /component/header</Link>
                                </>
                            )}

                            {isLoggedIn && userRole === "Owner" && (
                                <>
                                    <Link to="#">Link toevoegen in /component/header</Link>
                                </>
                            )}

                            {isLoggedIn && (
                                <>
                                    <Link to="/logout">Logout</Link>
                                </>
                            )}
                        </nav>
                    </header>

                    <div className="header-banner">
                        <h1 className="header-title">
                            Cars and All
                        </h1>
                        <p className="header-description">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor dicta possimus consequatur eveniet officia iusto. Modi aspernatur aliquam impedit vero facilis! Neque dolor modi aperiam odit sit reprehenderit quia facere!
                        </p>
                    </div>
                </div>
                <div className="background-image"></div>
            </div>
        </div>
    );
}

export default Header;
