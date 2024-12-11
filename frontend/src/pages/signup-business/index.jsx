import './styles.scss';
import React, {useRef} from "react";
import { Link } from 'react-router-dom';

function SignUpBusiness() {

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
        <div id="SignUpBody">
            <main className="SignUpMain">
                <section className="signup-container">
                    <b id="title-signup-bus"> Zakelijk Account Registreren</b>
                    <form action="/signupBussines" method="POST">
                        <div className="form-group">
                            <div>
                                <label  className="nameLabel">Voornaam</label>
                                <input
                                    type="text"
                                    className="SignUpInput"
                                    
                                    placeholder="Voer uw voornaam in"
                                    required
                                />
                            </div>
                            <div>
                                <label  className="nameLabel">Achternaam</label>
                                <input
                                    type="text"
                                    className="SignUpInput"
                                   
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
                              
                                placeholder="Voer uw tussenvoegsel in"
                            />
                        </div>
                        <div>
                            <label  className="nameLabel" >Email</label>
                            <input
                                type="email"
                                className="LargeInput"
                            
                                placeholder="Voer uw email in"
                                required
                            />
                        </div>
                        <div>
                            <label  className="nameLabel" >Bedrijfsnaam</label>
                            <input
                                type="text"
                                className="LargeInput"
                                placeholder="Voer uw bedrijfsnaam in"
                                required
                            />
                        </div>
                        <div>
                            <label  className="nameLabel" >Bedrijfsadres</label>
                            <input
                                type="adres"
                                className="LargeInput"
                             
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
                               
                                    placeholder="Voer uw postcode in"
                                    required
                                />
                            </div>
                            <div>
                                <label  className="nameLabel">KVK-nummer</label>
                                <input
                                    type="text"
                                    className="SignUpInput"
                                 
                                    placeholder="Voer het KVK-nummer in"
                
                                    required
                                />
                            </div>
                        </div>
                        <div>
                                <label className="passwordLabel">Wachtwoord</label>
                                <input
                                    type="password"
                                    className="LargeInput"
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
                                    placeholder="Herhaal uw wachtwoord"
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
                 
                </section>
                         <Link to="/rent-screen">
                            <button>next page</button>
                        </Link>

            </main>
        </div>
        
    </div>
    <footer>
     
       
    </footer>
    </>
    )
}

export default SignUpBusiness