import React, { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';  
import "./styles.scss";

function AccountSettings(){

    const password1Ref = useRef(null);
    const password2Ref = useRef(null);

    const togglePassword = () => {
        const type1 = password1Ref.current.type === "password" ? "text" : "password";
        const type2 = password2Ref.current.type === "password" ? "text" : "password";
        password1Ref.current.type = type1;
        password2Ref.current.type = type2;
    };

return (
    <>
    <header></header>
        <div className="accountsettings-box">
            <section className="as-container">
                <h2> Account Bewerken</h2>
                    <form>
                        <div className="as-group">
                            <div>
                                <label>Email:</label>
                                    <input 
                                        type = "text"
                                        className ="as-email"
                                        placeholder="GET current email"
                                        name = "email"
                                    />
                            </div>
                            <div>
                                <label>Woonadres:</label>
                                    <input 
                                        type = "text"
                                        className ="as-adress"
                                        placeholder="GET current adress"
                                        name = "adres"
                                    />
                            </div>
                            <div>
                                <label>Postcode:</label>
                                    <input 
                                        type = "text"
                                        className ="as-postalcode"
                                        placeholder="GET current postalcode"
                                        name = "postcode"
                                    />
                            </div>
                            <div>
                                <label>Wachtwoord:</label>
                                <input
                                    type="password"
                                    ref={password1Ref}
                                    placeholder="Voer wachtwoord in"
                                    name="password"
                                />
                            </div>
                            <div>
                                <label>Herhaal Wachtwoord:</label>
                                <input
                                    type="password"
                                    ref={password2Ref}
                                    placeholder="Herhaal wachtwoord"
                                    name="repeat_password"
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
                                <div>
                                <button type="submit" className="SignupButton">Opslaan</button>
                                </div>
                        </div>
                    </form>
            </section>
        </div>
    <footer></footer>
    </>
)
}
export default AccountSettings