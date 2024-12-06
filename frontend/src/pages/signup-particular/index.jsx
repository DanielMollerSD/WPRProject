import './styles.scss';
import React, {useRef} from "react";
import { Link } from 'react-router-dom';

function SignUpParticular() {

    const password1Ref = useRef(null);
    const password2Ref = useRef(null);

  const togglePassword = () =>{

    const type1 = password1Ref.current.type === "password" ? "text" : "password";
    const type2 = password2Ref.current.type === "password" ? "text": "password";

    password1Ref.current.type = type1;
    password2Ref.current.type = type2;

  }

    return (
        <>
        <header>
            
        </header>
    <div className="page page-signup">
        <div className="SignUpBody">
            <main className="SignUpMain">
                <section className="signup-container">
                    <h2>Registreren</h2>
                    <form action="/signupParticular" method="POST">
                        <div className="form-group">
                            <div>
                                <label  className="nameLabel">Voornaam</label>
                                <input
                                    type="text"
                                    className="SignUpInput"
                                    name="voornaam"
                                    placeholder="Voer uw voornaam in"
                                    required
                                />
                            </div>
                            <div>
                                <label  className="nameLabel">Achternaam</label>
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
                            <label  className="nameLabel">Tussenvoegsel</label>
                            <input
                                type="text"
                                className="SignUpInput"
                                name="tussenvoegsel"
                                placeholder="Voer uw tussenvoegsel in"
                            />
                        </div>
                        <div>
                            <label  className="nameLabel" >Email</label>
                            <input
                                type="email"
                                className="LargeInput"
                                name="email"
                                placeholder="Voer uw email in"
                                required
                            />
                        </div>
                        <div>
                            <label  className="nameLabel" >Woonadres</label>
                            <input
                                type="adres"
                                className="LargeInput"
                                name="adres"
                                placeholder="Voer uw straatnaam + huisnummer in"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <div>
                                <label  className="nameLabel">Postcode</label>
                                <input
                                    type="text"
                                    className="SignUpInput"
                                    name="postcode"
                                    placeholder="Voer uw postcode in"
                                    required
                                />
                            </div>
                            <div>
                                <label  className="nameLabel">Telefoonnummer</label>
                                <input
                                    type="text"
                                    className="SignUpInput"
                                    name="telefoonnummer"
                                    placeholder="Voer uw 06-nummer in"
                                    pattern="[0-10]{3}"
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
                                    pattern="\w{3,16}"
                                    required
                                    
                                />
                            </div>
                            <div>
                                <label className="passwordLabel"> Herhaal Wachtwoord</label>
                                <input
                                    type="password"
                                    className="LargeInput"
                                    name="password"
                                    placeholder="Herhaal uw wachtwoord in"
                                    ref={password2Ref}
                                    pattern="\w{3,16}"
                                    required
                                    
                                />
                            </div>

                            <div className="nameLabel">

                                
                            <input type="checkbox" className="chkbx" onClick= {togglePassword}

                            />Toon wachtwoord
                            </div>
    
                            <div >
                                <button htmlFor="signup button" className="SignupButton" type="submit">

                                Registreren

                                </button>

                            </div>
                    </form>

                    <script src="togglePassword.js"></script>

                     <Link to="/rent-screen">
                            <button>next page</button>
                        </Link>

                 
                </section>
            </main>
        </div>
    </div>
    <footer>
     
       
    </footer>
    </>
    )
}

export default SignUpParticular
