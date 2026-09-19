import React, { useState, useEffect } from 'react';
import projects from '../projects.json';
import ProjectCard, { type ProjectStint } from './ProjectCard';

interface SidebarProps {
  selectedCity?: string | null;
  setSelectedCity?: (city: string | null) => void;
}

// Extract the most recent 4-digit year mentioned in a date string (e.g. "2022—2024" -> 2024),
// used to sort a company's stints most-recent-first. Falls back to 0 if no year is found.
const extractLatestYear = (date?: string): number => {
  if (!date) return 0;
  const years = date.match(/\d{4}/g);
  if (!years) return 0;
  return Math.max(...years.map(Number));
};

const experienceCategories = [
  { label: 'Work', value: 'Work' },
  { label: 'Projects', value: 'Projects' }
];

const Sidebar: React.FC<SidebarProps> = ({ selectedCity, setSelectedCity }) => {
  const [selectedTech, setSelectedTech] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Work');
  const [showAllProjects, setShowAllProjects] = useState(false);


  // Auto-select the correct work_experience filter when a city is selected
  useEffect(() => {
    if (selectedCity) {
      // Find all projects for this city
      const cityProjects = projects.filter((p) => {
        if (Array.isArray(p.city)) {
          return p.city.map((c) => c.trim().toLowerCase()).includes(selectedCity.trim().toLowerCase());
        } else {
          return p.city.trim().toLowerCase() === selectedCity.trim().toLowerCase();
        }
      });
      // Check if any are 'Work' or 'Projects'
      const hasWork = cityProjects.some((p) => {
        const arr = Array.isArray(p.work_experience) ? p.work_experience : [p.work_experience];
        return arr.map((w) => (w || '').toLowerCase()).includes('work');
      });
      const hasProjects = cityProjects.some((p) => {
        const arr = Array.isArray(p.work_experience) ? p.work_experience : [p.work_experience];
        return arr.map((w) => (w || '').toLowerCase()).includes('projects');
      });
      if (hasWork && selectedCategory !== 'Work') {
        setSelectedCategory('Work');
        setShowAllProjects(false);
      } else if (!hasWork && hasProjects && selectedCategory !== 'Projects') {
        setSelectedCategory('Projects');
        setShowAllProjects(false);
      }
    }
  }, [selectedCity]);

  // Filter by city first
  const filteredProjects = selectedCity
    ? projects.filter((p) => {
        if (Array.isArray(p.city)) {
          return p.city.map((c) => c.trim().toLowerCase()).includes(selectedCity.trim().toLowerCase());
        } else {
          return p.city.trim().toLowerCase() === selectedCity.trim().toLowerCase();
        }
      })
    : projects;

  // Filter by work_experience category
  const categoryFilteredProjects = filteredProjects.filter((p) => {
    let workExpArr: string[] = [];
    if (Array.isArray(p.work_experience)) {
      workExpArr = p.work_experience;
    } else if (typeof p.work_experience === 'string') {
      workExpArr = [p.work_experience];
    }
    return workExpArr.map((w) => (w || '').toLowerCase()).includes(selectedCategory.toLowerCase());
  });

  // Collect all unique tech stacks for the current filtered category
  const allTechStacks = Array.from(
    new Set(
      categoryFilteredProjects.flatMap((p) =>
        Array.isArray(p.tech_stack)
          ? p.tech_stack.filter((t): t is string => typeof t === 'string' && t !== null)
          : []
      )
    )
  ).sort();

  // Then filter by tech stack
  const techFilteredProjects = selectedTech
    ? categoryFilteredProjects.filter((p) =>
        Array.isArray(p.tech_stack) &&
        p.tech_stack.filter((t): t is string => typeof t === 'string' && t !== null).includes(selectedTech)
      )
    : categoryFilteredProjects;

  let spotlightProjects: typeof projects = [];
  let otherProjects: typeof projects = [];

  // Always separate spotlight projects from others, regardless of city selection
  spotlightProjects = techFilteredProjects.filter((p) => p.spotlight);
  otherProjects = techFilteredProjects.filter((p) => !p.spotlight);

  // Combine spotlight and other projects for unified show more logic
  const allSidebarProjects = [...spotlightProjects, ...otherProjects];

  // Group entries that share the same title (e.g. multiple stints at the same company)
  // into a single card, each stint rendered as its own row.
  interface GroupedCard {
    key: string;
    title: string;
    logo?: string;
    spotlight: boolean;
    stints: ProjectStint[];
  }
  const groupedCards: GroupedCard[] = [];
  const groupIndexByTitle = new Map<string, number>();

  allSidebarProjects.forEach((project) => {
    const isWorkEntry = Array.isArray(project.work_experience)
      ? project.work_experience.includes('Work')
      : project.work_experience === 'Work';
    const title = project.title ?? '';
    const stint: ProjectStint = {
      id: project.id,
      role: isWorkEntry ? project.role : undefined,
      date: isWorkEntry ? project.date : undefined,
      city: project.city,
      description: project.description || undefined,
      link: project.link || undefined,
    };

    const existingIndex = groupIndexByTitle.get(title);
    if (existingIndex !== undefined) {
      groupedCards[existingIndex].stints.push(stint);
      if (project.spotlight) groupedCards[existingIndex].spotlight = true;
    } else {
      groupIndexByTitle.set(title, groupedCards.length);
      groupedCards.push({
        key: title || String(project.id),
        title,
        logo: isWorkEntry ? project.image ?? undefined : undefined,
        spotlight: !!project.spotlight,
        stints: [stint],
      });
    }
  });

  // Show each company's most recent stint first
  groupedCards.forEach((card) => {
    card.stints.sort((a, b) => extractLatestYear(b.date) - extractLatestYear(a.date));
  });

  // Legend text for the blue badge
  let badgeLegend = '';
  if (selectedCategory.toLowerCase() === 'work') badgeLegend = 'Full-time';
  else if (selectedCategory.toLowerCase() === 'projects') badgeLegend = 'Spotlights';
  else if (selectedCategory.toLowerCase() === 'travel') badgeLegend = 'International';

  return (
    <aside className="sidebar" style={{ paddingTop: 0 }}>
      <h3 className="sidebar-title" style={{  fontFamily: 'Arial', marginBottom: '0px', marginTop: 0 }}>Cartographies of my work</h3> 
      <p className="sidebar-subtitle" style={{ marginBottom: 6, marginTop: 0, maxWidth: 400, fontStyle: 'italic'}}>
        Explore by clicking on a city or filtering below:
      </p>
      
      {/* Ballot-style category selector and Clear Filters (mobile) */}
      <div className="ballot-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {experienceCategories.map((cat) => (
            <label key={cat.value} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 5, fontSize: '0.91rem', color: '#f5f5e6', fontWeight: 500 }}>
              <input
                type="radio"
                name="experience-category"
                value={cat.value}
                checked={selectedCategory === cat.value}
                onChange={() => {
                  setSelectedCategory(String(cat.value));
                  setShowAllProjects(false);
                }}
                style={{ display: 'none' }}
              />
              <span
                style={{
                  display: 'inline-block',
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  border: '2px solid #00a9fe',
                  background: selectedCategory === cat.value ? '#00a9fe' : 'transparent',
                  boxSizing: 'border-box',
                  marginRight: 1,
                  transition: 'background 0.2s, border 0.2s',
                  position: 'relative',
                }}
              >
                {selectedCategory === cat.value && (
                  <span
                    style={{
                      display: 'block',
                      width: 4.0,
                      height: 4.0,
                      borderRadius: '50%',
                      background: '#fff',
                      position: 'absolute',
                      top: 1.5,
                      left: 1.5,
                    }}
                  />
                )}
              </span>
              {cat.label}
            </label>
          ))}
        </div>
        <button
          type="button"
          className="clear-filters-btn"
          onClick={() => {
            setSelectedCategory('Work');
            setSelectedTech('');
            setShowAllProjects(false);
            if (setSelectedCity) setSelectedCity(null);
          }}
        >
          Clear Filters
        </button>
      </div>
      {/* Tech stack filter */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'inline-flex', gap: 6, flexWrap: 'wrap', verticalAlign: 'middle' }}>
          <button
            type="button"
            onClick={() => {
              setSelectedTech('');
              setShowAllProjects(false);
            }}
            style={{
              background: selectedTech === '' ? '#00a9fe' : '#000',
              color: selectedTech === '' ? '#fff' : '#f5f5e6',
              border: '1.2px solid #444',
              borderRadius: 7,
              padding: '0px 7px',
              fontSize: '0.85rem',
              fontStyle: 'normal',
              minHeight: 15,
              cursor: 'pointer',
              fontWeight: selectedTech === '' ? 700 : 400,
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            All
          </button>
          {allTechStacks.map((stack) => (
            <button
              key={stack}
              type="button"
              onClick={() => {
                setSelectedTech(String(stack));
                setShowAllProjects(false);
              }}
              style={{
                background: selectedTech === stack ? '#00a9fe' : '#000',
                color: selectedTech === stack ? '#fff' : '#f5f5e6',
                border: '1.2px solid #444',
                borderRadius: 7,
                padding: '0px 7px',
                fontSize: '0.85rem',
                fontStyle: 'normal',
                minHeight: 15,
                cursor: 'pointer',
                fontWeight: selectedTech === stack ? 700 : 400,
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              {stack}
            </button>
          ))}
        </div>
      </div>
      
      {/* Spotlight badge legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8, marginTop: 2, justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 14 }}>
          <div style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: '#00a9fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 10,
            fontWeight: 'bold',
            boxShadow: '0 0 3px 1px #00a9fe44',
          }}>★</div>
        </div>
        <span style={{ color: '#e0e0e0', fontSize: '0.85rem', fontWeight: 500 }}>{badgeLegend}</span>
      </div>

      
      
      {/* Project list scrollable area */}
      <div className="sidebar-scroll">
        <div className="sidebar-project-list">
          {groupedCards.length === 0 && selectedCity && (
            <div style={{ color: '#bbb', fontStyle: 'italic', marginTop: 12, marginBottom: 12 , fontSize: '0.5rem'}}>
              Nothing to see here!
            </div>
          )}
          {(showAllProjects ? groupedCards : groupedCards.slice(0, 5)).map((card) => (
            <div key={card.key} className="sidebar-project-card-wrapper">
              <ProjectCard
                title={card.title}
                logo={card.logo}
                spotlight={card.spotlight}
                stints={card.stints}
              />
            </div>
          ))}
          {groupedCards.length > 5 && !showAllProjects && (
            <button
              className="show-all-btn"
              style={{ margin: '16px auto 0 auto', display: 'block', fontSize: '0.92rem', padding: '4px 16px', borderRadius: 12, border: 'none', background: '#00a9fe', color: '#fff', cursor: 'pointer' }}
              onClick={() => setShowAllProjects(true)}
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 