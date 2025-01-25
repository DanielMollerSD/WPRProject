import { Link } from 'react-router-dom';
import './styles.scss';

function SignupSelectionScreen() {
    return (
        <>
            <div className="page page-signup-selection">
                    <div className="SelectionName">
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
                    </div>
            </div>
        </>
    );
}

export default SignupSelectionScreen;