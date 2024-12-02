import { Link, useLocation } from 'react-router-dom';
import './styles.scss';

function Header() {

    const location = useLocation();
    const isHomepage = location.pathname === '/' || location.pathname === '/home';

    return (
        
        <div className="component component-header">
            <div className={`header${isHomepage ? ' homepage' : ''}`}>
                <div className="container">
                    <header>
                        <nav>
                            <Link to="/">Home</Link>
                            <Link to="/register">Register</Link>
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
