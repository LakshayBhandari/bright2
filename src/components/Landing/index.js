import './styles.scss';
import { Link } from 'react-router-dom';
import { sections } from './constants';
import { Fragment } from 'react';
import Hero from '../Content/Hero';

const Landing = () => {
	return (
		<main className="landing" id='home'>
			<Hero/>
			<div className='sections'>
				{sections.map(section => {
					return (
						<div key={section.id} className='section'>
							<div className='section-wrapper'>
								<div className='section-info'>
									<div className='section-info-heading'>
										<h2>{section.title}</h2>
										<h2 style={{color: section.color}}>{section.subTitle}</h2>
									</div>
									<p>{section.text}</p>
									{section.link && 
									<Link to={section.link}>
										{section.linkText}
									</Link>}
									{section.outerLink &&
										<a href={section.outerLink} target='_blank'>
											{section.icon || <Fragment/>}
											{section.linkText}
										</a>
									}
								</div>
								<div className='section-image'>
									<img src={section.image} alt='Section'/>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</main>
	);
};

export default Landing;
