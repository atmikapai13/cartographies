import React from 'react';
import { asset } from '../utils/assetPath';

interface ProjectCardProps {
  title: string;
  image: string;
  description?: string;
  link?: string;
  spotlight?: boolean;
  role?: string;
  date?: string;
  tech_stack2?: string;
  city?: string | string[];
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, image, description, link, spotlight, role, date, tech_stack2, city }) => {
  return (
    <div className={`project-card${spotlight ? ' spotlight-card' : ''}`}>
      {spotlight && (
        <div className="spotlight-badge" title="Spotlight Project">★</div>
      )}
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className="project-title-link">
          <h4 className="project-card-title">{title} <span className="external-link-icon">↗</span></h4>
        </a>
      ) : (
        <h4 className="project-card-title">{title}</h4>
      )}
      <div className="project-card-row" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flexDirection: image ? 'row' : 'column' }}>
        <div className="project-card-image-col" style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          {image && (
            link ? (
              <a href={link} target="_blank" rel="noopener noreferrer" className="project-image-link">
                <img src={asset(image)} alt={title} className="project-card-image-large" />
              </a>
            ) : (
              <img src={asset(image)} alt={title} className="project-card-image-large" />
            )
          )}
          {role && (
            <div style={{ width: '100%', textAlign: 'left', marginTop: '0px' }}>
              <div className="project-role" style={{
                fontSize: '0.6rem !important',
                color: '#f5f5e6',
                fontWeight: 'bold',
                fontStyle: 'italic',
              }}>
                {role}
              </div>
              {date && (
                <div className="project-date" style={{
                  fontSize: '0.5rem !important',
                  color: '#e0e0e0',
                  marginTop: '0px',
                  fontWeight: 400,
                  fontStyle: 'italic',
                  paddingBottom: '3px',
                }}>
                  {date}
                </div>
              )}
              
            </div>
          )}
          {city && (
            <div style={{
              width: '100%',
              textAlign: 'left',
              marginTop: '0px',
            }}>
              <div className="project-city" style={{
                fontSize: '0.35rem !important',
                color: '#e0e0e0',
                fontStyle: 'italic',
                fontWeight: 100
              }}>
                📍 {Array.isArray(city) ? city[0] : city}
              </div>
            </div>
          )}

        </div>
        <div className="project-card-description-col" style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column' }}>
          {description && <p className="project-card-description" style={{ margin: 0, fontSize: '1rem', fontWeight: 500 }} dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br>') }}></p>}
          {tech_stack2 && (
            <div style={{ width: '100%', textAlign: 'left', marginTop: '6px', marginLeft: 0 }}>
              <div className="project-tech-stack2" style={{ fontSize: '0.7rem', color: '#a5d6fa', fontWeight: 500, fontStyle: 'italic' }}>
                <span style={{ fontWeight: 700, color: '#a5d6fa', fontStyle: 'normal' ,fontSize: '0.5rem'}}>Tech Stack:</span> <span style={{ fontStyle: 'italic', color: '#a5d6fa' , fontSize: '0.5rem'}}>{tech_stack2}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard; 