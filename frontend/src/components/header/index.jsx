import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import './styles.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Header() {
    const location = useLocation();
    const isHomepage = location.pathname === '/' || location.pathname === '/home';
    const navigate = useNavigate();
    const token = localStorage.getItem("access_token");

    let userRole = "Unknown";
    let isLoggedIn = false;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "Unknown";
            isLoggedIn = true;
        } catch (error) {
            console.error("Token decoding failed:", error);
        }
    }

    const handleLogout = () => {
        axios.delete(`${import.meta.env.VITE_APP_API_URL}/Logout`, {
            withCredentials: true,
        }).then((response) => {
            console.log("Logout successful", response);
            localStorage.clear();

            window.location.href = "/";
        }).catch((error) => {
            console.error("Error during logout:", error);
        });
    };

    return (

        <div className="component component-header">
            <div className={`header${isHomepage ? ' homepage' : ''}`}>
                <div className="container">
                    <header>
                        <nav>

                            <Link to="/">Home</Link>

                            {!isLoggedIn && (
                                <>
                                    <Link to="/signup-select">Register</Link>
                                    <Link to="/login">Login</Link>
                                </>
                            )}


                            {isLoggedIn && userRole === "Individual" && (
                                <>
                                    <Link to="/vehicle-overview">Voertuigen</Link>
                                    <Link to="/account-settings">Profiel</Link>

                                </>
                            )}


                            {isLoggedIn && userRole === "Owner" && (
                                <>
                                    <Link to="/business-account-crud">Medewerkers</Link>
                                    <Link to="/business-settings">Profiel</Link>
                                </>
                            )}


                            {isLoggedIn && userRole === "Wagenparkbeheerder" && (
                                <>
                                    <Link to="/business-account-crud">Medewerkers</Link>
                                    <Link to="/subscription-select">Abbonementen</Link>
                                </>
                            )}


                            {isLoggedIn && userRole === "Medewerker" && (
                                <>
                                    <Link to="/vehicle-overview">Voertuigen</Link>
                                </>
                            )}
                            

                            {isLoggedIn && userRole === "Backoffice" && (
                                <>
                                    <Link to="/rent-overview">Overzicht</Link>
                                    <Link to="/rent-requests">Aanvragen</Link>
                                    <Link to="/backoffice-subscription">Abbonementen</Link>
                                    <Link to="/vehicle-crud">Voertuigen</Link>
                                    <Link to="/frontoffice-crud">Frontoffice Beheren</Link>
                                    <Link to="/backoffice-privacy-page">Privacy</Link>
                                </>
                            )}


                            {isLoggedIn && userRole === "Frontoffice" && (
                                <>
                                    <Link to="/frontoffice-vehicle-overview">Voertuigen Beheren</Link>
                                </>
                            )}


                            {isLoggedIn && (
                                <>
                                    <Link to="/logout" onClick={handleLogout}>Logout</Link>
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
