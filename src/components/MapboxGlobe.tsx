import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import projects from "../projects.json";
import placeData from '../places.json';
import { asset } from '../utils/assetPath';

// Project cities data
const project_cities = [
    { id: 1, name: "New York", country: "USA", longitude: -73.95630, latitude: 40.75581 }, 
    { id: 2, name: "Hawaii", country: "USA", longitude: -155.5828, latitude: 19.8968},
    { id: 3, name: "San Francisco", country: "USA", longitude: -122.4830, latitude: 37.7689 }, 
    { id: 4, name: "Mumbai", country: "India", longitude: 72.8679, latitude: 19.1144 },
    { id: 5, name: "San Diego", country: "USA", longitude: -117.1611, latitude: 32.7157 },
    { id: 6, name: "Palm Springs", country: "USA", longitude: -116.5453, latitude: 33.8303 },
    { id: 7, name: "Berkeley", country: "USA", longitude: -122.2549, latitude: 37.8676},
    { id: 26, name: "Cafenated, North Berkeley", country: "USA", longitude: -122.2725, latitude: 37.8759 },
    { id: 8, name: "Oakland", country: "USA", longitude: -122.27208, latitude: 37.80903 },
    { id: 9, name: "Sydney", country: "Australia", longitude: 151.15115, latitude: -33.75535},
    { id: 10, name: "Singapore", country: "Singapore", longitude: 103.88870, latitude: 1.31748 },
    { id: 11, name: "Yokohama", country: "Japan", longitude: 139.6380, latitude: 35.4437 },
    { id: 12, name: "West Hollywood", country: "USA", longitude: -118.3617, latitude: 34.0900 },
    { id: 13, name: "Walnut Creek", country: "USA", longitude: -122.0664, latitude: 37.9184 },
    { id: 14, name: "Arizona", country: "USA", longitude: -112.185986, latitude: 33.538652 },
    { id: 15, name: "Nevada", country: "USA", longitude: -116.4194, latitude: 38.8026 },
    { id: 16, name: "Utah", country: "USA", longitude: -111.0937, latitude: 39.32098 },
    { id: 17, name: "New Jersey", country: "USA", longitude: -74.4057, latitude: 40.0583 },
    { id: 18, name: "Central Park", country: "USA", longitude: -73.97263890608842, latitude: 40.77703784020682 },
    { id: 27, name: "Cafe Aviva, Roosevelt Island", country: "USA", longitude: -73.94989719622808, latitude: 40.76205528704795 },
    { id: 20, name: "Brooklyn (BK11)", country: "USA", borough: "Brooklyn", longitude: -73.9332, latitude: 40.6536 },
    { id: 21, name: "Brooklyn (BK17)", country: "USA", borough: "Brooklyn", longitude: -73.9225, latitude: 40.6496 },
    { id: 22, name: "Bronx (BX5)", country: "USA", borough: "Bronx", longitude: -73.9020, latitude: 40.8317 },
    { id: 23, name: "Manhattan (MN10)", country: "USA", borough: "Manhattan", longitude: -73.9465, latitude: 40.8116 },
    { id: 24, name: "Queens (QN2)", country: "USA", borough: "Queens", longitude: -73.9326, latitude: 40.7612 },
    { id: 25, name: "Lower Manhattan", country: "USA", longitude: -74.0090, latitude: 40.7075 },
    { id: 26, name: "Christchurch", country: "New Zealand", longitude: 172.6306, latitude: -43.5321 },
    { id: 28, name: "London", country: "USA", longitude: 0.1281, latitude: 51.5080 },
    { id: 29, name: "East Village", country: "USA", longitude: -73.9857, latitude: 40.7282 },
    { id: 30, name: "Juhu", country: "India", longitude: 72.8267, latitude: 19.1074 },
    { id: 31, name: "Lincoln Center", country: "USA", longitude: -73.9847, latitude: 40.7720 },
  ];

const zoomGatedCities = ["Walnut Creek", "New Jersey", "Oakland", "Berkeley", "West Hollywood",
  "Brooklyn (BK11)", "Brooklyn (BK17)", "Bronx (BX5)", "Manhattan (MN10)", "Queens (QN2)", 
  "Lower Manhattan", "Christchurch", "Cafenated, North Berkeley", "Cafe Aviva, Roosevelt Island", 
  "London", "Central Park", "East Village", "Juhu", "Lincoln Center"
];

// Guided tour cities in order (by city name)
const tourCityNames = ["New York", "Central Park", "Oakland", "San Francisco", "Berkeley", "Mumbai"];

// Get tour cities from project_cities array
const tourCities = tourCityNames
  .map(cityName => project_cities.find(city => city.name === cityName))
  .filter((city): city is typeof project_cities[number] => Boolean(city));

// Dropdown cities - specific cities to show in the dropdown menu
const dropdownCityNames = ["New York", "Berkeley", "San Diego", "Mumbai"];

// Get dropdown cities from project_cities array
const dropdownCities = dropdownCityNames
  .map(cityName => project_cities.find(city => city.name === cityName))
  .filter((city): city is typeof project_cities[number] => Boolean(city));

// Music cities - cities with playlists  
const musicCityNames = ["Berkeley", "Mumbai", "Singapore", "Sydney", "Christchurch", "London"];

// Get music cities from project_cities array  
const musicCities = musicCityNames
  .map(cityName => project_cities.find(city => city.name === cityName))
  .filter((city): city is typeof project_cities[number] => Boolean(city));

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

interface MapboxGlobeProps {
  selectedCity: string | null;
  onCitySelect?: (city: string | null) => void;
  showDisclaimer: boolean;
}

export default function MapboxGlobe({ selectedCity, onCitySelect }: MapboxGlobeProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const activePopup = useRef<mapboxgl.Popup | null>(null);
  const rotationEnabled = useRef(true);
  // const popupTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // const moveEndListenerRef = useRef<(() => void) | null>(null);
  const programmaticZoomRef = useRef(false);
  const selectedMarkerRef = useRef<string | null>(null);
  const ZOOM_THRESHOLD = 2.5;
  const [pitch, setPitch] = useState(0);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  // const [isIconClicked, setIsIconClicked] = useState(false);
  const [showPitchControl, setShowPitchControl] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [currentTourIndex, setCurrentTourIndex] = useState(0);
  const [showMusicDropdown, setShowMusicDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [customPopupData, setCustomPopupData] = useState<{
    cityName: string;
    lngLat: [number, number];
    isTour: boolean;
  } | null>(null);


  const handlePitchChange = (newPitch: number) => {
    setPitch(newPitch);
    if (mapRef.current) {
      mapRef.current.setPitch(newPitch);
    }
  };

  const handleCityDropdownToggle = () => {
    // Add click animation
    // setIsIconClicked(true);
    // setTimeout(() => {
    //   setIsIconClicked(false);
    // }, 150);
    
    console.log('Dropdown toggle clicked, current state:', showCityDropdown);
    setShowCityDropdown(!showCityDropdown);
    console.log('Dropdown state set to:', !showCityDropdown);
  };

  const handleCitySelect = (city: typeof project_cities[number]) => {
    if (mapRef.current) {
      // Step 1: Close any existing popups
    if (activePopup.current) {
      activePopup.current.remove();
      activePopup.current = null;
    }

      rotationEnabled.current = false;
      if (onCitySelect) {
        onCitySelect(city.name);
      }
      
      // Step 2: Set up moveend listener for popup before starting animation
        const showPopup = () => {
          // Step 3: Open popup for new city after flyTo animation completes
          createCityPopup(city.name, [city.longitude, city.latitude]);
          // Remove the listener after use
          mapRef.current?.off('moveend', showPopup);
      };
      
      // Listen for moveend event (when flyTo animation completes)
      mapRef.current.on('moveend', showPopup);
      
      // Step 2: Fly to the new city
      mapRef.current.flyTo({
        center: [city.longitude, city.latitude],
        zoom: 11,
        speed: 2.0,
        curve: 1.40,
        easing(t) {
          return t;
        }
      });
    }
    setShowCityDropdown(false);
  };

  const handleCameraToggle = () => {
    setShowPitchControl(!showPitchControl);
  };

  const handleTourToggle = () => {
    setShowTour(!showTour);
    if (!showTour) {
      setCurrentTourIndex(0);
      // Start tour with first city
      startTourCity(0);
    } else {
      // End tour - close any popups and enable rotation
      if (activePopup.current) {
        activePopup.current.remove();
        activePopup.current = null;
      }
      rotationEnabled.current = true;
    }
  };

  const handleMusicToggle = () => {
    console.log('Music dropdown toggle clicked, current state:', showMusicDropdown);
    setShowMusicDropdown(!showMusicDropdown);
    console.log('Music dropdown state set to:', !showMusicDropdown);
  };

  const handleMusicCitySelect = (city: typeof project_cities[number]) => {
    if (mapRef.current) {
      // Close any existing popups
      if (activePopup.current) {
        activePopup.current.remove();
        activePopup.current = null;
      }

      rotationEnabled.current = false;
      if (onCitySelect) {
        onCitySelect(city.name);
      }
      
      // Set up moveend listener for popup before starting animation
      const showPopup = () => {
        // Open popup for selected city after flyTo animation completes
        createCityPopup(city.name, [city.longitude, city.latitude]);
        // Remove the listener after use
        mapRef.current?.off('moveend', showPopup);
      };
      
      // Listen for moveend event (when flyTo animation completes)
      mapRef.current.on('moveend', showPopup);

      // Fly to the selected city (matching regular city dropdown)
      mapRef.current.flyTo({
        center: [city.longitude, city.latitude],
        zoom: 11,
        speed: 2.0,
        curve: 1.40,
        easing(t) {
          return t;
        }
      });

      // Close the music dropdown
      setShowMusicDropdown(false);
    }
  };

  const startTourCity = (index: number) => {
    if (mapRef.current && tourCities[index]) {
      const city = tourCities[index];
      
      // Close any existing popups
      if (activePopup.current) {
        activePopup.current.remove();
        activePopup.current = null;
      }
      
    rotationEnabled.current = false;
      if (onCitySelect) {
        onCitySelect(city.name);
      }
      
        // Set up moveend listener for popup
        const showPopup = () => {
          createCityPopup(city.name, [city.longitude, city.latitude], true);
          mapRef.current?.off('moveend', showPopup);
        };
      
      mapRef.current.on('moveend', showPopup);
      
      // Fly to the city with higher zoom for 3D view
      mapRef.current.flyTo({
        center: [city.longitude, city.latitude],
        zoom: 16,
        pitch: 60,
        speed: 1.5,
        curve: 1.2,
        easing(t) {
          return t;
        }
      });
    }
  };

  const handleNextCity = () => {
    const nextIndex = (currentTourIndex + 1) % tourCities.length;
    setCurrentTourIndex(nextIndex);
    startTourCity(nextIndex);
  };

  const handlePrevCity = () => {
    const prevIndex = currentTourIndex === 0 ? tourCities.length - 1 : currentTourIndex - 1;
    setCurrentTourIndex(prevIndex);
    startTourCity(prevIndex);
  };


  const createCityPopup = (cityName: string, lngLat: [number, number], isTour: boolean = false) => {
    const isMobile = window.innerWidth <= 600;
    if (isMobile) return;

    if (!mapRef.current) return;

    if (activePopup.current) {
      activePopup.current.remove();
      activePopup.current = null;
    }

    // Find city info (place_description, date, playlist)
    const cityData = (placeData as any[]).find(
      (entry) => entry.city.trim().toLowerCase() === cityName.trim().toLowerCase()
    );

    let popupContent = `<div class="city-popup" style="text-align:center; max-height:250px; overflow:auto; scrollbar-width: none; -ms-overflow-style: none;">`;
    if (!cityData) {
      popupContent += ``;
    } else {
      popupContent += `<div class="city-description">`;
      popupContent += `<h3 style='margin-bottom: 3px; text-align:center;color:#007bff;'>${cityName}</h3>`;
      if (cityData.image) {
        popupContent += `<img src='${asset(cityData.image)}' alt='${cityName}' style='display:block;margin:0 auto 10px auto;max-width:320px; width:100%;height:auto;border-radius:10px;' onerror='console.error(\"Failed to load image:\", this.src)' onload='console.log(\"Image loaded successfully:\", this.src)' loading='lazy' />`;
      }
      popupContent += `<div style='font-size:0.7rem;color:#bdbdbd;margin-bottom:3px;text-align:center; font-style:italic;'><em>${cityData.date || ''}</em></div>`;
      popupContent += `<div style='font-size:0.5rem;color:#e0e0e0;text-align:center; font-style:italic;line-height:1.2;'>${cityData.place_description || ''}</div>`;
      if (cityData.playlist) {
        // Check if there's an embed URL or if we can extract playlist ID for embedding
        const hasEmbedUrl = cityData.playlist_embed;
        const playlistId = cityData.playlist.match(/playlist\/([a-zA-Z0-9]+)/)?.[1];
        
        if (hasEmbedUrl || playlistId) {
          // Create expandable playlist embed
          const embedSrc = hasEmbedUrl || `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`;
          
          popupContent += `<div class='popup-playlist' style='margin-top: 10px;'>
            <button 
              onclick="
                const playlist = this.nextElementSibling;
                if (playlist.style.display === 'none' || playlist.style.display === '') {
                  playlist.style.display = 'block';
                  this.innerHTML = 'my playlist ▲';
                } else {
                  playlist.style.display = 'none';
                  this.innerHTML = 'my playlist ▼';
                }
              " 
              style='font-size:0.6rem;color:#a5d6fa;margin-bottom:8px;text-align:center;font-weight:500;font-style:italic;background:none;border:none;cursor:pointer;padding:4px 8px;border-radius:6px;transition:background-color 0.2s;display:block;width:auto;margin:0 auto 8px auto;outline:none;box-shadow:none;'
              onmouseover="this.style.backgroundColor='rgba(165, 214, 250, 0.1)'"
              onmouseout="this.style.backgroundColor='transparent'"
            >
              my playlist ▼
            </button>
            <div style='display:none;margin-top:8px;'>
              <iframe 
                style="border-radius:12px" 
                src="${embedSrc}" 
                width="100%" 
                height="152" 
                frameBorder="0" 
                allowfullscreen="" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy">
              </iframe>
            </div>
          </div>`;
        } else {
          // Fallback to simple link if no embed is possible
          popupContent += `<div class='popup-playlist' style=' font-size:0.5rem;'><a href='${cityData.playlist}' target='_blank' rel='noopener noreferrer'>my playlist</a></div>`;
        }
      }
      popupContent += `</div>`;
    }
    popupContent += `</div>`;

    // Pause rotation when popup opens
    rotationEnabled.current = false;
    
    // Adjust offset based on tour mode - closer to marker for tour
    const offsetLngLat: [number, number] = isTour 
      ? [lngLat[0] - 0.001, lngLat[1]] // Closer to the right for tour mode
      : [lngLat[0] - 0.005, lngLat[1]]; // Regular offset for normal mode
    
    // Use larger width if there's an image or if there's a playlist embed
    const hasPlaylistEmbed = cityData?.playlist_embed || (cityData?.playlist && cityData.playlist.match(/playlist\/([a-zA-Z0-9]+)/));
    const popupWidth = cityData?.image || hasPlaylistEmbed ? '350px' : '250px';
    
    const popup = new mapboxgl.Popup({ maxWidth: popupWidth, anchor: 'right'})
      .setLngLat(offsetLngLat)
      .setHTML(popupContent)
      .addTo(mapRef.current);

    activePopup.current = popup;
    
    // Resume rotation when popup closes
    popup.on('close', () => {
      rotationEnabled.current = true;
      if (onCitySelect) onCitySelect(null);
      activePopup.current = null;
      
      // Clear selected marker
      selectedMarkerRef.current = null;
      
      // Refresh the marker layer to reset colors
      if (mapRef.current && mapRef.current.getLayer("city-markers")) {
        mapRef.current.removeLayer("city-markers");
        mapRef.current.addLayer({
          id: "city-markers",
          type: "circle",
          source: "cities",
          paint: {
            "circle-radius": [
              "case",
              ["in", ["get", "name"], ["literal", zoomGatedCities]], 4,
              5
            ],
            "circle-color": [
              "case",
              ["==", ["get", "name"], selectedMarkerRef.current], "#007bff",
              ["case",
                ["in", ["get", "name"], ["literal", zoomGatedCities]], "#ed462b",
                "#ed462b"
              ]
            ],
            "circle-stroke-width": [
              "case",
              ["==", ["get", "name"], selectedMarkerRef.current], 2,
              1
            ],
            "circle-stroke-color": [
              "case",
              ["==", ["get", "name"], selectedMarkerRef.current], "#ffffff",
              "#000000"
            ],
            "circle-opacity": 1.0,
          },
          filter: [
            "any",
            ["all", ...zoomGatedCities.map(city => ["!=", ["get", "name"], city])],
            ...zoomGatedCities.map(city => [
              "all",
              ["==", ["get", "name"], city],
              [">=", ["zoom"], 3]
            ])
          ]
        });
      }
    });
  };

  const closeCustomPopup = () => {
    setCustomPopupData(null);
      rotationEnabled.current = true;
      if (onCitySelect) onCitySelect(null);
      
      // Clear selected marker
      selectedMarkerRef.current = null;
      
      // Refresh the marker layer to reset colors
      if (mapRef.current && mapRef.current.getLayer("city-markers")) {
        mapRef.current.removeLayer("city-markers");
        mapRef.current.addLayer({
          id: "city-markers",
          type: "circle",
          source: "cities",
          paint: {
            "circle-radius": [
              "case",
              ["in", ["get", "name"], ["literal", zoomGatedCities]], 4,
              5
            ],
            "circle-color": [
              "case",
              ["==", ["get", "name"], selectedMarkerRef.current], "#007bff",
              ["case",
                ["in", ["get", "name"], ["literal", zoomGatedCities]], "#ed462b",
                "#ed462b"
              ]
            ],
            "circle-stroke-width": [
              "case",
              ["==", ["get", "name"], selectedMarkerRef.current], 2,
              1
            ],
            "circle-stroke-color": [
              "case",
              ["==", ["get", "name"], selectedMarkerRef.current], "#ffffff",
              "#000000"
            ],
            "circle-opacity": 1.0,
          },
          filter: [
            "any",
            ["all", ...zoomGatedCities.map(city => ["!=", ["get", "name"], city])],
            ...zoomGatedCities.map(city => [
              "all",
              ["==", ["get", "name"], city],
              [">=", ["zoom"], 3]
            ])
          ]
        });
      }
  };
  
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (selectedCity === null) {
      // If city selection is cleared, remove the active popup but don't change the view.
      if (activePopup.current) {
        activePopup.current.remove();
        activePopup.current = null;
      }
      // Only clear custom popup on desktop
      if (!isMobile) {
        setCustomPopupData(null);
      }
      rotationEnabled.current = true;
    }
  }, [selectedCity, isMobile]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
        setShowMusicDropdown(false);
      }
    };

    if (showCityDropdown || showMusicDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCityDropdown, showMusicDropdown]);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;

    // const isMobile = window.innerWidth <= 600;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/atmikapai13/cmfcvbodb000c01qs0e048je4", // Custom style URL
      projection: "globe",
      center: [-100, 40],
      zoom: window.innerWidth <= 600 ? 0.30 : 1.7,
      bearing: 0,
      pitch: pitch,
      minZoom: window.innerWidth <= 600 ? 0.30 : 1.4,
      attributionControl: false,
    });
    mapRef.current = map;
    
    // Add built-in Mapbox controls (desktop only)
    if (window.innerWidth > 600) {
      map.addControl(new mapboxgl.NavigationControl(), 'top-left');
      
      // Custom positioning for navigation control
      setTimeout(() => {
        const navControl = document.querySelector('.mapboxgl-ctrl-group');
        if (navControl) {
          // Use setAttribute to force CSS with !important
          navControl.setAttribute('style', `
            position: absolute !important;
            top: 231px !important;
            left: 12px !important;
            right: auto !important;
            bottom: auto !important;
          `);
          console.log('Navigation control positioned at top-left');
        }
      }, 100);
    }
    // map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    // map.addControl(new mapboxgl.GeolocateControl(), 'top-right');
    


    map.on("style.load", () => {
      console.log("Loaded projects:", projects);
      map.setFog({
        color: "rgb(95, 174, 253)",
        "high-color": "rgb(6, 113, 189)",
        "horizon-blend": 0.05,
        "space-color": "rgb(21, 21, 21)", //// //rgb(1, 31, 52)
        "star-intensity": 1.0,
      });

      // --- Add city markers ---
      const cityFeatures = project_cities.map((city) => {
        // Find corresponding place data to get the name field
        const placeDataEntry = (placeData as any[]).find(
          (entry) => entry.city.trim().toLowerCase() === city.name.trim().toLowerCase()
        );
        
        return {
          type: "Feature" as const,
          geometry: {
            type: "Point" as const,
            coordinates: [city.longitude, city.latitude],
          },
          properties: {
            id: city.id,
            name: city.name,
            country: city.country,
            displayName: placeDataEntry?.name || null, // Use name field from places.json if available
          },
        };
      });

      map.addSource("cities", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: cityFeatures,
        },
      });

      map.addLayer({
        id: "city-markers",
        type: "circle",
        source: "cities",
        paint: {
          "circle-radius": [
            "case",
            ["in", ["get", "name"], ["literal", zoomGatedCities]], 4,
            5
          ],
          "circle-color": [
            "case",
            ["==", ["get", "name"], selectedMarkerRef.current], "#007bff",
            ["case",
              ["in", ["get", "name"], ["literal", zoomGatedCities]], "#ed462b",
              "#ed462b"
            ]
          ],
          "circle-stroke-width": [
            "case",
            ["==", ["get", "name"], selectedMarkerRef.current], 2,
            1
          ],
          "circle-stroke-color": [
            "case",
            ["==", ["get", "name"], selectedMarkerRef.current], "#ffffff",
            "#000000"
          ],
          "circle-opacity": 1.0,
        },
        filter: [
          "any",
          ["all", ...zoomGatedCities.map(city => ["!=", ["get", "name"], city])],
          ...zoomGatedCities.map(city => [
            "all",
            ["==", ["get", "name"], city],
            [">=", ["zoom"], 3]
          ])
        ]
      });

      // Add text labels layer
      map.addLayer({
        id: "city-labels",
        type: "symbol",
        source: "cities",
        layout: {
          "text-field": ["get", "displayName"],
          "text-font": ["Open Sans Regular"],
          "text-size": 10,
          "text-offset": [0.0, 1.3],
          "text-anchor": "center",
          "text-allow-overlap": true,
          "text-ignore-placement": true,
        },
        paint: {
          "text-color": "#ed462b",
          "text-halo-color": "#ffffff",
          "text-halo-width": 2,
        },
        filter: [
          "all",
          ["!=", ["get", "displayName"], null],
          [">=", ["zoom"], 8]
        ]
      });

      // Popup on marker click
      map.on("click", "city-markers", (e) => {
        const cityName = e.features?.[0]?.properties?.name;
        if (!cityName) return;
        
        // Update selected marker
        selectedMarkerRef.current = cityName;
        
        // Refresh the marker layer to update colors
        if (map.getLayer("city-markers")) {
          map.removeLayer("city-markers");
          map.addLayer({
            id: "city-markers",
            type: "circle",
            source: "cities",
            paint: {
              "circle-radius": [
                "case",
                ["in", ["get", "name"], ["literal", zoomGatedCities]], 4,
                5
              ],
              "circle-color": [
                "case",
                ["==", ["get", "name"], selectedMarkerRef.current], "#007bff",
                ["case",
                  ["in", ["get", "name"], ["literal", zoomGatedCities]], "#ed462b",
                  "#ed462b"
                ]
              ],
              "circle-stroke-width": [
                "case",
                ["==", ["get", "name"], selectedMarkerRef.current], 2,
                1
              ],
              "circle-stroke-color": [
                "case",
                ["==", ["get", "name"], selectedMarkerRef.current], "#ffffff",
                "#000000"
              ],
              "circle-opacity": 1.0,
            },
            filter: [
              "any",
              ["all", ...zoomGatedCities.map(city => ["!=", ["get", "name"], city])],
              ...zoomGatedCities.map(city => [
                "all",
                ["==", ["get", "name"], city],
                [">=", ["zoom"], 3]
              ])
            ]
          });
        }
        
        if (onCitySelect) onCitySelect(cityName);
        createCityPopup(cityName, [e.lngLat.lng, e.lngLat.lat]);
      });

      // Clear city selection when clicking on map background
      map.on("click", (e) => {
        // Only clear if not clicking on a city marker
        const features = map.queryRenderedFeatures(e.point, { layers: ['city-markers'] });
        if (features.length === 0 && onCitySelect) {
          onCitySelect(null);
          
          // Clear selected marker
          selectedMarkerRef.current = null;
          
          // Refresh the marker layer to reset colors
          if (map.getLayer("city-markers")) {
            map.removeLayer("city-markers");
            map.addLayer({
              id: "city-markers",
              type: "circle",
              source: "cities",
              paint: {
                "circle-radius": [
                  "case",
                  ["in", ["get", "name"], ["literal", zoomGatedCities]], 4,
                  5
                ],
                "circle-color": [
                  "case",
                  ["==", ["get", "name"], selectedMarkerRef.current], "#007bff",
                  ["case",
                    ["in", ["get", "name"], ["literal", zoomGatedCities]], "#ed462b",
                    "#ed462b"
                  ]
                ],
                "circle-stroke-width": [
                  "case",
                  ["==", ["get", "name"], selectedMarkerRef.current], 2,
                  1
                ],
                "circle-stroke-color": [
                  "case",
                  ["==", ["get", "name"], selectedMarkerRef.current], "#ffffff",
                  "#000000"
                ],
                "circle-opacity": 1.0,
              },
              filter: [
                "any",
                ["all", ...zoomGatedCities.map(city => ["!=", ["get", "name"], city])],
                ...zoomGatedCities.map(city => [
                  "all",
                  ["==", ["get", "name"], city],
                  [">=", ["zoom"], 3]
                ])
              ]
            });
          }
        }
      });

      map.on("mouseenter", "city-markers", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "city-markers", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    // Globe rotation
    let isUserInteracting = false;

    function rotateGlobe() {
      const currentZoom = map.getZoom();
      if (rotationEnabled.current && !isUserInteracting && currentZoom < ZOOM_THRESHOLD) {
        const center = map.getCenter();
        const newLng = ((center.lng - 0.1) + 360) % 360;
        map.setCenter([newLng, center.lat]);
      }
      setTimeout(rotateGlobe, 16.7);
    }

    // Add zoom change listener
    map.on('zoom', () => {
      const currentZoom = map.getZoom();
      if (currentZoom >= ZOOM_THRESHOLD) {
        rotationEnabled.current = false;
      }
    });

    map.on("mousedown", () => { isUserInteracting = true; rotationEnabled.current = false; });
    map.on("touchstart", () => { isUserInteracting = true; rotationEnabled.current = false; });
    map.on("mouseup", () => { 
      isUserInteracting = false; 
      rotationEnabled.current = map.getZoom() < ZOOM_THRESHOLD;
    });
    map.on("touchend", () => { 
      isUserInteracting = false; 
      rotationEnabled.current = map.getZoom() < ZOOM_THRESHOLD;
    });
    map.on("load", rotateGlobe);

    // Listen for zoomend to resume rotation if user zooms out
    const onZoomEnd = () => {
      if (programmaticZoomRef.current) {
        // Ignore this zoomend if it was programmatic
        programmaticZoomRef.current = false;
        return;
      }
      const currentZoom = map.getZoom();
      if (currentZoom <= ZOOM_THRESHOLD) {
        rotationEnabled.current = true;
        // Reset pitch to 0 when fully zoomed out
        if (map.getPitch() > 0) {
          map.setPitch(0);
          setPitch(0);
        }
      } else {
        rotationEnabled.current = false;
      }
    };
    map.on('zoomend', onZoomEnd);

    return () => {
      map.remove();
      map.off('zoomend', onZoomEnd);
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <style>
        {`
          .custom-pitch-slider {
            background: linear-gradient(to right, #007bff 0%, #007bff ${(pitch / 85) * 100}%, #555 ${(pitch / 85) * 100}%, #555 100%) !important;
          }
          
          .custom-pitch-slider::-webkit-slider-thumb {
            appearance: none;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #ffffff;
            cursor: pointer;
            border: 2px solid #007bff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            transition: all 0.15s ease;
          }
          
          .custom-pitch-slider::-webkit-slider-thumb:hover {
            transform: scale(1.15);
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
          }
          
          .custom-pitch-slider::-webkit-slider-thumb:active {
            transform: scale(1.05);
          }
          
          .custom-pitch-slider::-moz-range-thumb {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #ffffff;
            cursor: pointer;
            border: 2px solid #007bff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            transition: all 0.15s ease;
          }
          
          .custom-pitch-slider::-moz-range-thumb:hover {
            transform: scale(1.15);
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
          }
          
          .custom-pitch-slider::-webkit-slider-track {
            background: transparent;
            border: none;
          }
          
          .custom-pitch-slider::-moz-range-track {
            background: transparent;
            border: none;
          }
        `}
      </style>
      <div
        ref={mapContainer}
        style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
      />

      {/* Cities Image with Dropdown - Hidden on mobile */}
      {!isMobile && (
        <div 
          ref={dropdownRef}
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 1000
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <img 
              src={asset('assets/map-cities.png')}
              alt="Cities" 
              onClick={handleCityDropdownToggle}
              style={{
                maxWidth: "50px",
                height: "auto",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "transform 0.2s ease, box-shadow 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
            
            {/* Tour Icon */}
            <img 
              src={asset('assets/map-tour.png')}
              alt="Tour" 
              onClick={handleTourToggle}
              style={{
                maxWidth: "50px",
                height: "auto",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "transform 0.2s ease, box-shadow 0.2s ease"
              }}
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
              onClick={handleMusicToggle}
              style={{
                maxWidth: "45px",
                height: "auto",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                marginLeft: "4px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
            
          </div>
        
          {/* Dropdown Menu */}
          {showCityDropdown && (
            <div style={{
              position: "absolute",
              top: "10px",
              left: "65px", // Fixed position since this is desktop only
              background: "rgba(0, 0, 0, 0.8)",
              borderRadius: "8px",
              boxShadow: "none",
              padding: "5px 0",
              minWidth: "150px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
              borderRight: "1px solid rgba(255, 255, 255, 0.1)",
              overflow: "hidden",
              animation: "fadeInRight 0.3s ease-out",
              zIndex: 1001 // Ensure it's above other elements
            }}>
              <div style={{
                fontSize: "0.9rem",
                fontWeight: "bold",
                color: "#e0e0e0",
                fontFamily: "'Courier New', Courier, monospace",
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
                  onClick={() => handleCitySelect(city)}
                  style={{
                    padding: "2px 12px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    color: "#e0e0e0",
                    fontFamily: "'Courier New', Courier, monospace",
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

          {/* Music Dropdown Menu */}
          {showMusicDropdown && (
            <div style={{
              position: "absolute",
              top: "119px", // Position below the music icon
              left: "65px",
              background: "rgba(0, 0, 0, 0.8)",
              borderRadius: "8px",
              boxShadow: "none",
              padding: "5px 0",
              minWidth: "150px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
              borderRight: "1px solid rgba(255, 255, 255, 0.1)",
              overflow: "hidden",
              animation: "fadeInRight 0.3s ease-out",
              zIndex: 1001
            }}>
              <div style={{
                fontSize: "0.9rem",
                fontWeight: "bold",
                color: "#e0e0e0",
                fontFamily: "'Courier New', Courier, monospace",
                textTransform: "uppercase",
                padding: "4px 12px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                marginBottom: "0px"
              }}>
                My Playlists:
              </div>
              {musicCities.map((city) => (
                <div
                  key={city.id}
                  onClick={() => handleMusicCitySelect(city)}
                  style={{
                    padding: "2px 12px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    color: "#e0e0e0",
                    fontFamily: "'Courier New', Courier, monospace",
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
        </div>
      )}

      {/* Camera Icon - positioned above NavigationControl - Hidden on mobile */}
      {!isMobile && (
        <div style={{
          position: "absolute",
          top: "180px",
          left: "10px",
          zIndex: 1000
        }}>
          <img 
            src={asset('assets/map-3d.png')}
            alt="3D" 
            onClick={handleCameraToggle}
            style={{
              maxWidth: "50px",
              height: "auto",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              
              padding: "5px",
              
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          />
        </div>
      )}

      {/* Pitch Control - Hidden on mobile */}
      {showPitchControl && !isMobile && (
        <div style={{
          position: "absolute",
          top: "180px",
          left: "65px",
          background: "rgba(0, 0, 0, 0.8)",
          borderRadius: "8px",
          boxShadow: "none",
          padding: "8px 12px",
          minWidth: "140px",
          height: "40px",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          overflow: "hidden",
          animation: "fadeInRight 0.3s ease-out"
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
              fontFamily: "'Courier New', Courier, monospace",
              textTransform: "uppercase",
              fontWeight: "bold",
              minWidth: "20px"
            }}>2D</span>
            <input
              type="range"
              min="0"
              max="85"
              value={pitch}
              onChange={(e) => handlePitchChange(Number(e.target.value))}
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
              fontFamily: "'Courier New', Courier, monospace",
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

      {/* Tour Controls - Hidden on mobile */}
      {showTour && !isMobile && (
        <div style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(0, 0, 0, 0.8)",
          borderRadius: "6px",
          padding: "8px 20px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          zIndex: 1000
        }}>
          <div style={{
            color: "#e0e0e0",
            fontSize: "0.9rem",
            fontFamily: "'Courier New', Courier, monospace",
            textTransform: "uppercase",
            fontWeight: "bold",
            marginRight: "12px",
            whiteSpace: "nowrap"
          }}>
            Guided Tour
          </div>
          
          <button
            onClick={handlePrevCity}
            style={{
              background: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "#e0e0e0",
              padding: "4px 8px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.75rem",
              fontFamily: "'Courier New', Courier, monospace",
              textTransform: "uppercase",
              whiteSpace: "nowrap"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            ← Prev
          </button>
          
          <div style={{
            color: "#e0e0e0",
            fontSize: "0.8rem",
            fontFamily: "'Courier New', Courier, monospace",
            textTransform: "uppercase",
            minWidth: "120px",
            textAlign: "center",
            whiteSpace: "nowrap"
          }}>
            {currentTourIndex + 1} / {tourCities.length}: {tourCities[currentTourIndex]?.name}
          </div>
          
          <button
            onClick={handleNextCity}
            style={{
              background: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "#e0e0e0",
              padding: "4px 8px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.75rem",
              fontFamily: "'Courier New', Courier, monospace",
              textTransform: "uppercase",
              whiteSpace: "nowrap"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Next →
          </button>
          
          <button
            onClick={() => setShowTour(false)}
            style={{
              background: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "#e0e0e0",
              padding: "4px 8px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.75rem",
              fontFamily: "'Courier New', Courier, monospace",
              textTransform: "uppercase",
              whiteSpace: "nowrap"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            ✕ Close
          </button>
        </div>
      )}

      {/* Custom Popup Area - Below map, above sidebar - Desktop only */}
      {customPopupData && !isMobile && (
        <div style={{
          position: "absolute",
          bottom: isMobile ? "60px" : "0px", // Above footer on mobile, at bottom on desktop
          left: isMobile ? "3vw" : "20px",
          right: isMobile ? "3vw" : "420px", // Leave space for sidebar on desktop
          background: "rgba(35, 35, 35, 0.95)",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          color: "#f8f6f0",
          zIndex: 1000,
          maxHeight: "300px",
          overflow: "auto",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <h3 style={{ 
              margin: 0, 
              color: "#007bff", 
              fontSize: "1.2rem", 
              fontWeight: "bold" 
            }}>
              {customPopupData.cityName}
            </h3>
            <button
              onClick={closeCustomPopup}
              style={{
                background: "transparent",
                border: "none",
                color: "#f8f6f0",
                fontSize: "18px",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "4px",
                lineHeight: 1
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              ×
            </button>
          </div>
          
          {(() => {
            const cityData = (placeData as any[]).find(
              (entry) => entry.city.trim().toLowerCase() === customPopupData.cityName.trim().toLowerCase()
            );
            
            if (!cityData) return null;
            
            return (
              <div style={{ textAlign: "center" }}>
                {cityData.image && (
                  <img 
                    src={asset(cityData.image)}
                    alt={customPopupData.cityName} 
                    style={{
                      display: "block",
                      margin: "0 auto 12px auto",
                      maxWidth: "100%",
                      width: "auto",
                      height: "auto",
                      maxHeight: "150px",
                      borderRadius: "8px",
                      objectFit: "cover"
                    }}
                    onError={(e) => {
                      console.error("Failed to load image:", e.currentTarget.src);
                    }}
                    onLoad={(e) => {
                      console.log("Image loaded successfully:", e.currentTarget.src);
                    }}
                    loading="lazy"
                  />
                )}
                
                {cityData.date && (
                  <div style={{
                    fontSize: "0.8rem",
                    color: "#bdbdbd",
                    marginBottom: "8px",
                    fontStyle: "italic"
                  }}>
                    {cityData.date}
                  </div>
                )}
                
                {cityData.place_description && (
                  <div style={{
                    fontSize: "0.9rem",
                    color: "#e0e0e0",
                    lineHeight: "1.4",
                    marginBottom: "12px",
                    textAlign: "left"
                  }}>
                    {cityData.place_description}
                  </div>
                )}
                
                {cityData.playlist && (
                  <div style={{ textAlign: "center" }}>
                    <a 
                      href={cityData.playlist} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        color: "#a5d6fa",
                        fontWeight: "bold",
                        fontSize: "0.8rem",
                        textDecoration: "none",
                        padding: "6px 12px",
                        border: "1px solid #a5d6fa",
                        borderRadius: "6px",
                        display: "inline-block",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#a5d6fa";
                        e.currentTarget.style.color = "#000";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#a5d6fa";
                      }}
                    >
                      My Playlist
                    </a>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

    </div>
  );
} 