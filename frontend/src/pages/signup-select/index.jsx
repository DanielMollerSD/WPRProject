import { Link } from 'react-router-dom';
import './styles.scss';

function SignupSelectionScreen() {
    return (
        <>
            <header></header>

            <div className="page page-signup-selection">
                <div className="SelectionBody">
                    <main className="SelectionName">
                        <section className="selection-container">
                            <h2>Selecteer uw type account</h2>
                            <div id="form-group-select">
                               
                                <Link to="/signup-particular">
                                    <button className="SelectionButtons particular-icon">
                                        <p className="lowerButtonText">Particulier</p>
                                    </button>
                                </Link>
                                <Link to="/signup-business">
                                    <button className="SelectionButtons business-icon">
                                        <p className="lowerButtonText">Zakelijk</p>
                                    </button>
                                </Link>
                            </div>
                        </section>
                    </main>
                </div>
            </div>

            <footer></footer>
        </>
    );
}

export default SignupSelectionScreen;