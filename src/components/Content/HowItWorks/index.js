import { useState, useEffect } from "react";
import "./styles.scss";
import { steps } from "./constants";
import Hero from '../Hero';
import axios from "axios";
import urls from '../../../utils/urls';
import BookSlider from '../../BookSlider';
import { Link } from "react-router-dom";

const HowItWorks = () => {
    const [bestsellers, setBestsellers] = useState([]);

    const getBestsellers = async () => {
        try {
            const response = await axios.get(urls.getCategoryBooks, {params: {category_name: 'Best Seller - New York Times'}});
            console.log(response);
            setBestsellers(response.data.books);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getBestsellers();
    }, []);

    return (
        <div className="how-it-works">
            <div className="steps">
                {steps.map((step) => {
                    return (
                        <div key={step.id} className="step">
                            <div className="step-number">
                                <p>Step {step.id}</p>
                            </div>
                            <div className="step-content">
                                <div className="step-image">
                                    <img src={step.image} alt="Step" />
                                </div>
                                <div className="step-info">
                                    <div className="step-info-heading">
                                        <h2>{step.title}</h2>
                                        <h2>{step.subTitle}</h2>
                                    </div>
                                    <p>{step.text}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <Hero/>
            <BookSlider
                title='Bestsellers'
                books={bestsellers}
            />
            <Link to='/browse-library'>
                Browse Library
            </Link>
        </div>
    );
};

export default HowItWorks;
