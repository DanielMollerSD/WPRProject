import './styles.scss'
import { Link } from 'react-router-dom'

function Footer() {

    return (
        <>
            <div className="component component-footer">
                <footer className='footer'>
                    <div className='container'>
                        <div className='row'>
                            <div className='footer-column col-md-5'>
                                <h4 className='footer-title'>Over ons</h4>
                                <ul className='footer-items'>
                                    <li className='footer-item'>Welkom bij CarsAndAll, uw betrouwbare partner voor het huren van auto's, campers en caravans. Of u nu op zoek bent naar een avontuur met een camper, een gezellige roadtrip in een auto of een comfortabele caravan voor een vakantie, wij bieden de perfecte voertuigen voor uw reis.</li>
                                </ul>
                            </div>
                            <div className='footer-column col-md-4'>
                                <h4 className='footer-title'>Socials</h4>
                                <ul className='footer-items'>
                                    <li className='footer-item'><a href="mailto:carsandall@gmail.com">Email <i className="fa-regular fa-envelope"></i></a></li>
                                    <li className='footer-item'><Link to="#">Instagram <i className="fa-brands fa-instagram"></i></Link></li>
                                    <li className='footer-item'><Link to="#">TikTok <i className="fa-brands fa-tiktok"></i></Link></li>
                                    <li className='footer-item'><Link to="#">LinkedIn <i className="fa-brands fa-linkedin"></i></Link></li>
                                </ul>
                            </div>
                            <div className='footer-column col-md-3'>
                                <h4 className='footer-title'>Extra</h4>
                                <ul className='footer-items'>
                                    <li className='footer-item'><Link to="/signup-backoffice">Backoffice</Link></li>
                                    <li className='footer-item'><Link to="/privacy-page">Privacy Verklaring</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="row">
                            <div className="copyright">© {new Date().getFullYear()} CarsAndAll. All rights reserved.</div>
                        </div>
                    </div>
                </footer>
            </div>


        </>
    )
}

export default Footer