import { FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';
import './styles.scss';
import {Link} from 'react-router-dom';

const Footer = () => {
	return (
		<footer className="footer">
			<div className="banner">
				<h2>Library - Home Delivered</h2>
				<div className='banner-image' style={{backgroundImage: 'url(/footer.png)'}}></div>
			</div>
			<div className='footer-links-wrap'>
				<div className="footer-links-container">
					<ul className="footer-links">
						<li><b>Get Connected</b></li>
						<li><Link to="/about-us">About Us</Link></li>
						<li><Link to="/contact-us">Contact Us</Link></li>
						<li><a href="/#faqs">FAQs</a></li>
					</ul>
					<ul className="footer-links">
						<li><b>Policy</b></li>
						<li><Link to="/disclaimer">Disclaimer</Link></li>
						<li><Link to="/privacy-policy">Privacy Policy</Link></li>
						<li><Link to="/refund-policy">Refund Policy</Link></li>
						<li><Link to="/terms-and-conditions">Terms and Conditions</Link></li>
					</ul>
					<div className="footer-social-links">
						<b>Follow Us</b>
						<div className="social-links">
							<div><a target='_blank' rel="noreferrer" href="https://twitter.com/scraplabs"><FaTwitter /></a></div>
							<div><a target='_blank' rel="noreferrer" href="https://www.facebook.com/people/brightrclub/100090330153935/"><FaFacebook /></a></div>
							<div><a target='_blank' rel="noreferrer" href="https://www.instagram.com/brightr.club/"><FaInstagram /></a></div>
						</div>
					</div>
					<h1>Bright<span>R</span>.Club</h1>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
