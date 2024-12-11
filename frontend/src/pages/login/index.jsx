import "./styles.scss";

function Login() {

    return (
        <>
        <div className="page page-login">
        <div id="LoginBody">
            <main id="LoginMain">
                <section className="login-container">
                    <h2>Inloggen</h2>
                    <form action="/login" method="POST">
                        <div className="form-group">
                            <label htmlFor="email" id="LoginLabel" >Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Voer uw email in"
                                required
                                className="LoginInput"
                            />
                        </div>
    
                        <div className="form-group">
                            <label htmlFor="password" id="LoginLabel">Wachtwoord</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Voer uw wachtwoord in"
                                required
                                className="LoginInput"
                            />
                        </div>
    
                        <button id="LoginButton" type="submit" className="btn">
                            Inloggen
                        </button>
    
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

export default Login
