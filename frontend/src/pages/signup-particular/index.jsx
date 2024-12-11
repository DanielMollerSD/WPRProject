import './styles.scss';
import React, { useRef } from "react";
import { Link } from 'react-router-dom';

function SignUpParticular() {
    const password1Ref = useRef(null);
    const password2Ref = useRef(null);

    const togglePassword = () => {
        const type1 = password1Ref.current.type === "password" ? "text" : "password";
        const type2 = password2Ref.current.type === "password" ? "text" : "password";
        password1Ref.current.type = type1;
        password2Ref.current.type = type2;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
    
       
        const formData = {
            voornaam: e.target.voornaam.value,
            achternaam: e.target.achternaam.value,
            tussenvoegsel: e.target.tussenvoegsel.value || null,
            email: e.target.email.value,
            adres: e.target.adres.value,
            postcode: e.target.postcode.value,
            telefoonnummer: e.target.telefoonnummer.value,
            password: e.target.password.value,
        };
    
        try {
            
            const response = await fetch("https://localhost:5001/api/customer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
    
            if (response.ok) {
            
                alert("Account created successfully!");
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (err) {
            console.error("Failed to create account:", err);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <>
            <header></header>
            <div className="page page-signup">
                <div className="SignUpBody">
                    <main className="SignUpMain">
                        <section className="signup-container">
                            <h2>Registreren</h2>
                            <form onSubmit={handleFormSubmit}>
                                <div className="form-group">
                                    <div>
                                        <label className="nameLabel">Voornaam</label>
                                        <input
                                            type="text"
                                            className="SignUpInput"
                                            name="voornaam"
                                            placeholder="Voer uw voornaam in"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="nameLabel">Achternaam</label>
                                        <input
                                            type="text"
                                            className="SignUpInput"
                                            name="achternaam"
                                            placeholder="Voer uw achternaam in"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="nameLabel">Tussenvoegsel</label>
                                    <input
                                        type="text"
                                        className="SignUpInput"
                                        name="tussenvoegsel"
                                        placeholder="Voer uw tussenvoegsel in"
                                    />
                                </div>
                                <div>
                                    <label className="nameLabel">Email</label>
                                    <input
                                        type="email"
                                        className="LargeInput"
                                        name="email"
                                        placeholder="Voer uw email in"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="nameLabel">Woonadres</label>
                                    <input
                                        type="text"
                                        className="LargeInput"
                                        name="adres"
                                        placeholder="Voer uw straatnaam + huisnummer in"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <div>
                                        <label className="nameLabel">Postcode</label>
                                        <input
                                            type="text"
                                            className="SignUpInput"
                                            name="postcode"
                                            placeholder="Voer uw postcode in"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="nameLabel">Telefoonnummer</label>
                                        <input
                                            type="text"
                                            className="SignUpInput"
                                            name="telefoonnummer"
                                            placeholder="Voer uw 06-nummer in"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="passwordLabel">Wachtwoord</label>
                                    <input
                                        type="password"
                                        className="LargeInput"
                                        name="password"
                                        placeholder="Voer uw wachtwoord in"
                                        ref={password1Ref}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="passwordLabel">Herhaal Wachtwoord</label>
                                    <input
                                        type="password"
                                        className="LargeInput"
                                        name="password-repeat"
                                        placeholder="Herhaal uw wachtwoord in"
                                        ref={password2Ref}
                                        required
                                    />
                                </div>

                                <div className="nameLabel">
                                    <input
                                        type="checkbox"
                                        className="chkbx"
                                        onClick={togglePassword}
                                    />
                                    Toon wachtwoord
                                </div>

                                <div>
                                <button type="submit" className="SignupButton">Registreren</button>
                                </div>
                            </form>

                            <Link to="/rent-screen">
                                <button>next page</button>
                            </Link>
                        </section>
                    </main>
                </div>
            </div>
            <footer></footer>
        </>
    );
}

export default SignUpParticular;
