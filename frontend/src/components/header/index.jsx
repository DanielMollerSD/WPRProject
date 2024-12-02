import { Link } from 'react-router-dom';
import './styles.scss';

function Header() {
    return (
        <div className="component component-header">
            <div className="header">
                <div className="container">
                    <header>
                        <nav>
                            <Link to="/">Home</Link>
                            <Link to="/register">register</Link>
                            <Link to="/login">Login</Link>
                        </nav>
                    </header>

                    <div className="header-banner">
                        <h1 className="header-title">
                            Cars and All
                        </h1>
                        <p className="header-description">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor dicta possimus consequatur eveniet officia iusto. Modi aspernatur aliquam impedit vero facilis! Neque dolor modi aperiam odit sit reprehenderit quia facere!
                        </p>
                    </div>
                </div>
                <div className="background-image"></div>
            </div>
        </div>
    );
}

export default Header;
