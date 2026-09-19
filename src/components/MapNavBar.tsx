import type { RefObject } from "react";
import { asset } from "../utils/assetPath";

export interface NavCity {
  id: number;
  name: string;
  longitude: number;
  latitude: number;
  country: string;
  borough?: string;
}

interface MapNavBarProps {
  isMobile: boolean;
  dropdownRef: RefObject<HTMLDivElement | null>;
  showIconMenu: boolean;
  onIconMenuToggle: () => void;
  showCityDropdown: boolean;
  onCityDropdownToggle: () => void;
  onTourToggle: () => void;
  onMusicToggle: () => void;
  dropdownCities: NavCity[];
  onCitySelect: (city: NavCity) => void;
  showMusicDropdown: boolean;
  musicCities: NavCity[];
  onMusicCitySelect: (city: NavCity) => void;
  onCameraToggle: () => void;
  showPitchControl: boolean;
  pitch: number;
  onPitchChange: (newPitch: number) => void;
}

// Radial fan-out layout: icons arranged on a quarter-circle arc around the
// question-mark trigger, evenly spaced 30° apart from straight up (tour) to
// straight right (3D toggle), matching the Figma reference.
const FAN_RADIUS = 80;
const ICON_SIZE = 30;
const fanOffset = (angleDeg: number) => {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    left: Math.round(FAN_RADIUS * Math.cos(rad)),
    bottom: Math.round(FAN_RADIUS * Math.sin(rad)),
  };
};

const TOUR_POS = fanOffset(90); // straight up
const MUSIC_POS = fanOffset(60); // upper-right
const CITIES_POS = fanOffset(30); // lower-right
const CAMERA_POS = fanOffset(0); // straight right

function iconButtonStyle(pos: { left: number; bottom: number }, size = ICON_SIZE) {
  return {
    position: "absolute" as const,
    left: `${pos.left}px`,
    bottom: `${pos.bottom}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "50%",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    zIndex: 1000,
  };
}

export default function MapNavBar({
  isMobile,
  dropdownRef,
  showIconMenu,
  onIconMenuToggle,
  showCityDropdown,
  onCityDropdownToggle,
  onTourToggle,
  onMusicToggle,
  dropdownCities,
  onCitySelect,
  showMusicDropdown,
  musicCities,
  onMusicCitySelect,
  onCameraToggle,
  showPitchControl,
  pitch,
  onPitchChange,
}: MapNavBarProps) {
  if (isMobile) return null;

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "absolute",
        bottom: "20px",
        left: "10px",
        width: `${ICON_SIZE}px`,
        height: `${ICON_SIZE}px`,
      }}
    >
      {/* Question mark trigger */}
      <img
        src={asset('assets/map-question.png')}
        alt="Menu"
        onClick={onIconMenuToggle}
        style={{
          ...iconButtonStyle({ left: 0, bottom: 0 }),
          zIndex: 1002,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      />

      {showIconMenu && (
        <>
          {/* Tour Icon */}
          <img
            src={asset('assets/map-tour.png')}
            alt="Tour"
            onClick={onTourToggle}
            style={iconButtonStyle(TOUR_POS)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          />

          {/* Music Icon */}
          <img
            src={asset('assets/map-music.png')}
            alt="Music"
            onClick={onMusicToggle}
            style={iconButtonStyle(MUSIC_POS)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          />

          {/* Cities Icon */}
          <img
            src={asset('assets/map-cities.png')}
            alt="Cities"
            onClick={onCityDropdownToggle}
            style={iconButtonStyle(CITIES_POS)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          />

          {/* 3D / Camera Icon */}
          <img
            src={asset('assets/map-3d.png')}
            alt="3D"
            onClick={onCameraToggle}
            style={iconButtonStyle(CAMERA_POS)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          />

          {/* Cities Dropdown Menu - opens beside the Cities icon */}
          {showCityDropdown && (
            <div style={{
              position: "absolute",
              left: `${CITIES_POS.left + ICON_SIZE + 10}px`,
              bottom: `${CITIES_POS.bottom}px`,
              background: "rgba(0, 0, 0, 0.8)",
              borderRadius: "8px",
              boxShadow: "none",
              padding: "5px 0",
              minWidth: "150px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              overflow: "hidden",
              animation: "fadeInRight 0.3s ease-out",
              zIndex: 1001
            }}>
              <div style={{
                fontSize: "0.9rem",
                fontWeight: "bold",
                color: "#e0e0e0",
                fontFamily: "sans-serif",
                textTransform: "uppercase",
                padding: "4px 12px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                marginBottom: "0px"
              }}>
                Cities:
              </div>
              {dropdownCities.map((city) => (
                <div
                  key={city.id}
                  onClick={() => onCitySelect(city)}
                  style={{
                    padding: "2px 12px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    color: "#e0e0e0",
                    fontFamily: "sans-serif",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    transition: "background-color 0.2s ease",
                    borderRadius: "0",
                    margin: "0"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#e0e0e0";
                  }}
                >
                  {city.name}
                </div>
              ))}
            </div>
          )}

          {/* Music Dropdown Menu - opens beside the Music icon */}
          {showMusicDropdown && (
            <div style={{
              position: "absolute",
              left: `${MUSIC_POS.left + ICON_SIZE + 10}px`,
              bottom: `${MUSIC_POS.bottom}px`,
              background: "rgba(0, 0, 0, 0.8)",
              borderRadius: "8px",
              boxShadow: "none",
              padding: "5px 0",
              minWidth: "150px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              overflow: "hidden",
              animation: "fadeInRight 0.3s ease-out",
              zIndex: 1001
            }}>
              <div style={{
                fontSize: "0.9rem",
                fontWeight: "bold",
                color: "#e0e0e0",
                fontFamily: "sans-serif",
                textTransform: "uppercase",
                padding: "4px 12px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                marginBottom: "0px"
              }}>
                My Playlists
              </div>
              {musicCities.map((city) => (
                <div
                  key={city.id}
                  onClick={() => onMusicCitySelect(city)}
                  style={{
                    padding: "2px 12px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    color: "#e0e0e0",
                    fontFamily: "sans-serif",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    transition: "background-color 0.2s ease",
                    borderRadius: "0",
                    margin: "0"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(165, 214, 250, 0.2)";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#e0e0e0";
                  }}
                >
                  {city.name}
                </div>
              ))}
            </div>
          )}

          {/* Pitch Control - opens beside the 3D icon */}
          {showPitchControl && (
            <div style={{
              position: "absolute",
              left: `${CAMERA_POS.left + ICON_SIZE + 10}px`,
              bottom: `${CAMERA_POS.bottom}px`,
              background: "rgba(0, 0, 0, 0.8)",
              borderRadius: "8px",
              boxShadow: "none",
              padding: "8px 12px",
              minWidth: "140px",
              height: "40px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              overflow: "hidden",
              animation: "fadeInRight 0.3s ease-out",
              zIndex: 1001
            }}>
              <div style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                height: "100%",
                justifyContent: "space-between",
                gap: "8px"
              }}>
                <span style={{
                  fontSize: "0.6rem",
                  color: "#e0e0e0",
                  fontFamily: "sans-serif",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  minWidth: "20px"
                }}>2D</span>
                <input
                  type="range"
                  min="0"
                  max="85"
                  value={pitch}
                  onChange={(e) => onPitchChange(Number(e.target.value))}
                  className="custom-pitch-slider"
                  style={{
                    width: "80px",
                    height: "3px",
                    borderRadius: "2px",
                    background: "#444",
                    outline: "none",
                    cursor: "pointer",
                    WebkitAppearance: "none",
                    appearance: "none",
                    position: "relative",
                    flex: "1"
                  }}
                />
                <span style={{
                  fontSize: "0.6rem",
                  color: "#e0e0e0",
                  fontFamily: "sans-serif",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  minWidth: "20px"
                }}>3D</span>
                <div style={{
                  fontSize: "0.5rem",
                  color: "#ffffff",
                  fontFamily: "sans-serif",
                  fontWeight: "500",
                  minWidth: "30px",
                  textAlign: "center",
                  marginLeft: "4px"
                }}>
                  {pitch}°
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
