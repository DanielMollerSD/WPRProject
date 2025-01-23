import './styles.scss'
import { Link } from 'react-router-dom'

function Footer() {

    return (
        <>
        <div className="component component-footer">
            <footer className='footer'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-5'>
                            <h4 className='footerText'>Over ons</h4>
                            <ul className='footerText'>
                                <li>dewqdq</li>
                                <li>dewqdq</li>
                                <li>dewqdq</li>
                                <li>dewqdq</li>
                            </ul>
                        </div>
                        <div className='col-md-4'>
                            <h4 className='footerText'>Extra</h4>
                            <ul className='footerText'>
                                <li>dewqdq</li>
                                <li>dewqdq</li>
                                <li>dewqdq</li>
                                <li>dewqdq</li>
                            </ul>
                        </div>
                        <div className='col-md-3'>
                            <h4 className='footerText'>Socials</h4>
                            <ul className='footerText'>
                            <li>Instagram <i className="fa-brands fa-instagram"></i></li>
                            <li>TikTok <i className="fa-brands fa-tiktok"></i></li>
                            <li>LinkedIn <i className="fa-brands fa-linkedin"></i></li>
                            <li><Link to="/signup-backoffice">Backoffice</Link></li>
                            <li><Link to="/privacy-page">Privacy Verklaring</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </div>

        
        </> 
    )
}

export default Footer