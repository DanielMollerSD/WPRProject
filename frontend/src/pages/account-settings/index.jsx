import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./styles.scss";

function AccountSettings() {
    const password1Ref = useRef(null);
    const password2Ref = useRef(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState(""); // Validation error state
    const [userData, setUserData] = useState({
        email: "",
        address: "",
        postalCode: "",
        firstName: "",
        lastName: "",
        password: "",
        repeatPassword: "" // Add repeat password to state
    });

    const togglePassword = () => {
        const type1 = password1Ref.current.type === "password" ? "text" : "password";
        const type2 = password2Ref.current.type === "password" ? "text" : "password";
        password1Ref.current.type = type1;
        password2Ref.current.type = type2;
    };

    useEffect(() => {
        const fetchData = () => {
            setLoading(true);
            setError(null);

            axios
                .get("https://localhost:7265/api/Customer", {
                    withCredentials: true // Include cookies with the request
                })
                .then((response) => {
                    setData(response.data); // Set the fetched data
                    setLoading(false);
                })
                .catch((error) => {
                    setError(error.message); // Handle the error
                    setLoading(false);
                });
        };

        fetchData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission

        // Validate password fields
        if (userData.password !== userData.repeatPassword) {
            setValidationError("Passwords do not match!"); // Set error message
            return;
        }

        setLoading(true);
        setError(null);
        setValidationError(""); // Clear validation error if passwords match

        // Prepare updated user data
        const updatedUserData = {
            email: userData.email,
            address: userData.address,
            postalCode: userData.postalCode,
            firstName: userData.firstName,
            lastName: userData.lastName,
            password: userData.password
        };

        axios
            .put("https://localhost:7265/api/Customer", updatedUserData, {
                withCredentials: true
            })
            .then((response) => {
                console.log("User data updated:", response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    };

    if (loading) {
        return (
            <>
                <div>Loading...</div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <div>Error!</div>
            </>
        );
    }

    if (!data) {
        return (
            <>
                <div>No data found!</div>
            </>
        );
    }

    return (
        <>
            <header></header>
            <div className="accountsettings-box">
                <section className="as-container">
                    <h2> Account Bewerken </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="as-group">
                            <div>
                                <label>Email:</label>
                                <input
                                    type="text"
                                    className="as-email"
                                    placeholder={data.email}
                                    name="email"
                                    value={userData.email} // Controlled input
                                    onChange={(e) => setUserData({ ...userData, email: e.target.value })} // Update on change
                                />
                            </div>
                            <div>
                                <label>Woonadres:</label>
                                <input
                                    type="text"
                                    className="as-adress"
                                    placeholder={data.address}
                                    name="adres"
                                    value={userData.address} // Controlled input
                                    onChange={(e) => setUserData({ ...userData, address: e.target.value })} // Update on change
                                />
                            </div>
                            <div>
                                <label>Postcode:</label>
                                <input
                                    type="text"
                                    className="as-postalcode"
                                    placeholder={data.postalCode}
                                    name="postcode"
                                    value={userData.postalCode} // Controlled input
                                    onChange={(e) =>
                                        setUserData({ ...userData, postalCode: e.target.value })
                                    } // Update on change
                                />
                            </div>
                            <div>
                                <label>Wachtwoord:</label>
                                <input
                                    type="password"
                                    ref={password1Ref}
                                    placeholder="Voer wachtwoord in"
                                    name="password"
                                    value={userData.password} // Bind to state
                                    onChange={(e) =>
                                        setUserData({ ...userData, password: e.target.value })
                                    } // Update state
                                />
                            </div>
                            <div>
                                <label>Herhaal Wachtwoord:</label>
                                <input
                                    type="password"
                                    ref={password2Ref}
                                    placeholder="Herhaal wachtwoord"
                                    name="repeatPassword"
                                    value={userData.repeatPassword} // Bind to state
                                    onChange={(e) =>
                                        setUserData({ ...userData, repeatPassword: e.target.value })
                                    } // Update state
                                />
                            </div>
                            <div>
                                <input
                                    type="checkbox"
                                    className="chkbx"
                                    onChange={togglePassword}
                                />
                                Toon wachtwoord
                            </div>

                            {validationError && (
                                <div style={{ color: "red", marginBottom: "10px" }}>
                                    {validationError}
                                </div>
                            )}

                            <div>
                                <button type="submit" className="SignupButton">
                                    Opslaan
                                </button>
                            </div>
                        </div>
                    </form>
                </section>
            </div>
            <footer></footer>
        </>
    );
}

export default AccountSettings;
