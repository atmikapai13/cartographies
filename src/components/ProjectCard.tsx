import React from 'react';
import { asset } from '../utils/assetPath';

const LOGO_STYLE: React.CSSProperties = {
  width: '28px',
  height: '28px',
  objectFit: 'contain',
  flexShrink: 0,
};

export interface ProjectStint {
  id: number;
  role?: string;
  date?: string;
  city?: string | string[];
  description?: string;
  link?: string;
}

interface ProjectCardProps {
  title: string;
  logo?: string;
  spotlight?: boolean;
  stints: ProjectStint[];
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, logo, spotlight, stints }) => {
  return (
    <div className={`project-card${spotlight ? ' spotlight-card' : ''}`}>
      {spotlight && (
        <div className="spotlight-badge" title="Spotlight Project">★</div>
      )}
      <h4 className="project-card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {logo && (
          <img
            src={asset(logo)}
            alt=""
            style={LOGO_STYLE}
          />
        )}
        <span>{title}</span>
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {stints.map((stint) => {
          const cityLabel = Array.isArray(stint.city) ? stint.city[0] : stint.city;
          const detailLine = [
            stint.date,
            cityLabel ? `📍 ${cityLabel}` : ''
          ].filter(Boolean).join(' ');

          return (
            <div key={stint.id} style={{ marginBottom: '10px' }}>
              {stint.role && (
                <div className="project-role" style={{
                  fontSize: '0.6rem !important',
                  color: '#f5f5e6',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  textAlign: 'left',
                }}>
                  {stint.role}
                </div>
              )}
              {detailLine && (
                <div className="project-date" style={{
                  fontSize: '0.42rem !important',
                  color: '#e0e0e0',
                  fontWeight: 400,
                  fontStyle: 'italic',
                  paddingBottom: '3px',
                  textAlign: 'left',
                }}>
                  {detailLine}
                </div>
              )}
              {stint.description && (
                <p
                  className="project-card-description"
                  style={{ margin: 0, marginBottom: '6px', fontSize: '1rem', fontWeight: 500 }}
                  dangerouslySetInnerHTML={{ __html: stint.description.replace(/\n/g, '<br>') }}
                />
              )}
              {stint.link && (
                <a
                  href={stint.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    color: '#a5d6fa',
                    fontWeight: 'bold',
                    fontSize: '0.7rem',
                    textDecoration: 'none',
                    padding: '4px 10px',
                    border: '1px solid #a5d6fa',
                    borderRadius: '6px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#a5d6fa';
                    e.currentTarget.style.color = '#000';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#a5d6fa';
                  }}
                >
                  Check out project ↗
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectCard;
