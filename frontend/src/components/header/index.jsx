import React from "react";
import { Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./styles.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Header() {
    const location = useLocation();
    const isHomepage = location.pathname === "/" || location.pathname === "/home";
    const navigate = useNavigate();
    const token = localStorage.getItem("access_token");
    const [userData, setUserData] = useState({ firstName: "" });
    const [loadingUsername, setLoadingUsername] = useState(true);

    let userRole = "Unknown";
    let isLoggedIn = false;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            userRole =
                decoded[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                ] || "Unknown";
            isLoggedIn = true;
        } catch (error) {
            console.error("Token decoding failed:", error);
        }
    }

    const handleLogout = () => {
        axios
            .delete(`${import.meta.env.VITE_APP_API_URL}/Logout`, {
                withCredentials: true,
            })
            .then((response) => {
                console.log("Logout successful", response);
                localStorage.clear();

                window.location.href = "/";
            })
            .catch((error) => {
                console.error("Error during logout:", error);
            });
    };

    useEffect(() => {
        const fetchName = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/Customer/fetch-name`, {
                    withCredentials: true,
                });
                setUserData({ firstName: response.data.firstName });

                console.log(response);
            } catch (error) {
                console.error("Error fetching name:", error);
            } finally {
                setLoadingUsername(false);
            }
        };
        fetchName();
    }, [location]);

    return (
        <div className="component component-header">
            <div className={`header${isHomepage ? " homepage" : ""}`}>
                <div className="container">
                    <header>

                        {isLoggedIn && !isHomepage && (
                            <div className="headerUsername">
                                {loadingUsername ? "Loading..." : userData.firstName}
                            </div>
                        )}

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
                                    <Link to="/individual/rents">Overzicht</Link>
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
                                    <Link to="/business/rents">Overzicht</Link>
                                    <Link to="/business-account-crud">Medewerkers</Link>
                                    <Link to="/subscription-select">Abonnementen</Link>
                                </>
                            )}

                            {isLoggedIn && userRole === "Medewerker" && (
                                <>
                                    <Link to="/vehicle-overview">Voertuigen</Link>
                                </>
                            )}

                            {isLoggedIn && userRole === "Backoffice" && (
                                <>
                                    <Link to="/rent-requests">Verzoeken</Link>
                                    <Link to="/rent-overview">Overzicht</Link>
                                    <Link to="/backoffice-subscription">Abonnementen</Link>
                                    <Link to="/vehicle-crud">Voertuigen</Link>
                                    <Link to="/frontoffice-crud">Frontoffice</Link>
                                    <Link to="/backoffice-privacy-page">Privacy</Link>
                                </>
                            )}

                            {isLoggedIn && userRole === "Frontoffice" && (
                                <>
                                    <Link to="/frontoffice-vehicle-overview">
                                        Voertuigen Beheren
                                    </Link>
                                </>
                            )}

                            {isLoggedIn && (
                                <>
                                    <Link to="/logout" onClick={handleLogout}>
                                        Logout
                                    </Link>
                                </>
                            )}
                        </nav>
                    </header>

                    <div className="header-banner">

                        {isLoggedIn ? (
                            <h1 className="header-title">Welkom {loadingUsername ? "Loading..." : userData.firstName}</h1>
                        ) : (
                            <h1 className="header-title">CarsAndAll</h1>
                        )}

                        <p className="header-description">
                            CarsAndAll biedt een breed scala aan voertuigen voor elke reis. Huur een auto, camper of caravan en ontdek de vrijheid van de weg. Eenvoudig, snel en betrouwbaar.
                        </p>
                    </div>
                </div>
                <div className="background-image"></div>
            </div>
        </div>
    );
}

export default Header;
