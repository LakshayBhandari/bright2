import './styles.scss';
import aboutUs from './AboutUs';
import contactUs from './ContactUs';
import disclaimer from './Disclaimer';
import privacyPolicy from './PrivacyPolicy';
import refundPolicy from './RefundPolicy';
import termsAndConditions from './TermsAndConditions';

const contentPages = {
    'About Us': {content: aboutUs},
    'Contact Us': {content: contactUs},
    'Disclaimer': {content: disclaimer},
    'Privacy Policy': {content: privacyPolicy},
    'Refund Policy': {content: refundPolicy},
    'Terms and Conditions': {content: termsAndConditions},
};

const Content = ({type}) => {
    return (
        <div className={`content ${type}-content`}>
            <h1 style={{color: '#4285F4'}}>{type}</h1>
            <div className='content-container'>
                {contentPages[type].content}
            </div>
        </div>
    );
};

export default Content;
