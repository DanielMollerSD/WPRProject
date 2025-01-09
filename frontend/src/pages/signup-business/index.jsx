import './styles.scss';
import React, { useRef, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import EmailVerificationSuccess from '../../functions/EmailVerificationSucces';

function SignUpBusiness() {
    const [email, setEmail] = useState('');
    const [verificationStatus, setVerificationStatus] = useState(null);

    const password1Ref = useRef(null);
    const password2Ref = useRef(null);
    const navigate = useNavigate();

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const togglePassword = () => {
        const type1 = password1Ref.current.type === "password" ? "text" : "password";
        const type2 = password2Ref.current.type === "password" ? "text" : "password";

        password1Ref.current.type = type1;
        password2Ref.current.type = type2;
    };

    const handleVerifyClick = async () => {
        try {
            const response = await axios.post('/api/send-verification-email', { email });
            if (response.status === 200) {
                setVerificationStatus('success');
            } else {
                setVerificationStatus('error');
            }
        } catch (error) {
            console.error("Failed to send email:", error);
            setVerificationStatus('error');
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            FirstName: e.target.voornaam.value,
            LastName: e.target.achternaam.value,
            TussenVoegsel: e.target.tussenvoegsel.value || null,
            Email: e.target.email.value,
            BusinessName: e.target.naam.value,
            BusinessAddress: e.target.adres.value,
            BusinessPostalCode: e.target.postcode.value,
            Kvk: parseInt(e.target.kvk.value, 10), // Ensure this is an integer
            Password: e.target.password.value,
        };
        

        console.log("Sending request to backend...");
        try {
            const response = await fetch("https://localhost:7265/api/Business/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Account created successfully!");
                navigate("/login");
            } else {
                const error = await response.json();
                alert(`Error: ${error?.message || "Unknown error occurred."}`);
            }
        } catch (err) {
            console.error("Request failed:", err);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <>
            <header></header>
            <div className="page page-signup">
                <div id="SignUpBody">
                    <main className="SignUpMain">
                        <section className="signup-container">
                            <b id="title-signup-bus">Zakelijk Account Registreren</b>
                            <form onSubmit={handleFormSubmit}>
                                <div>
                                    <label className="nameLabel">Voornaam</label>
                                    <input type="text" className="LargeInput" name="voornaam" placeholder="Voer uw voornaam" required />
                                </div>
                                <div>
                                    <label className="nameLabel">Achternaam</label>
                                    <input type="text" className="LargeInput" name="achternaam" placeholder="Voer uw achternaam in" required />
                                </div>
                                <div>
                                    <label className="nameLabel">Tussenvoegsel</label>
                                    <input type="text" className="SignUpInput" name="tussenvoegsel" placeholder="Voer uw tussenvoegsel in" />
                                </div>
                                <div>
                                    <label className="nameLabel">Email</label>
                                    <input
                                        type="email"
                                        className="LargeInput"
                                        name="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        placeholder="Voer uw email in"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="nameLabel">Bedrijfsnaam</label>
                                    <input type="text" name="naam" className="LargeInput" placeholder="Voer uw bedrijfsnaam in" required />
                                </div>
                                <div>
                                    <label className="nameLabel">Bedrijfsadres</label>
                                    <input type="text" className="LargeInput" name="adres" placeholder="Voer uw straatnaam + huisnummer in" required />
                                </div>
                                <div className="form-group">
                                    <div>
                                        <label className="nameLabel">Postcode</label>
                                        <input type="text" className="SignUpInput" name="postcode" placeholder="Voer uw postcode in" required />
                                    </div>
                                    <div>
                                        <label className="nameLabel">KVK-nummer</label>
                                        <input type="text" className="SignUpInput" name="kvk" placeholder="Voer het KVK-nummer in" required />
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
                                        pattern="\w{3,16}"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="passwordLabel">Herhaal Wachtwoord</label>
                                    <input
                                        type="password"
                                        className="LargeInput"
                                        placeholder="Herhaal uw wachtwoord"
                                        ref={password2Ref}
                                        pattern="\w{3,16}"
                                        required
                                    />
                                </div>
                                <div className="nameLabel">
                                    <input type="checkbox" className="chkbx" onClick={togglePassword} />
                                    Toon wachtwoord
                                </div>
                                <div>
                                    <button htmlFor="signup button" className="SignupButton" type="submit">
                                        Registreren
                                    </button>
                                </div>
                            </form>
                            {verificationStatus === 'success' && <div>Email sent successfully!</div>}
                            {verificationStatus === 'error' && <div>Failed to send email. Please try again.</div>}
                        </section>
                        <Link to="/rent-screen">
                            <button>Next Page</button>
                        </Link>
                    </main>
                </div>
            </div>
            <footer></footer>
        </>
    );
}

export default SignUpBusiness;
