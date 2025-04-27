import { useEffect, useRef } from 'react';

interface LocationMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  markers?: { lat: number; lng: number; title: string; icon?: string }[];
  className?: string;
}

// IMPORTANT: Set your Google Maps API key in a .env file as VITE_GOOGLE_MAPS_API_KEY=your_key_here

export function LocationMap({ 
  latitude, 
  longitude, 
  zoom = 15, 
  markers = [],
  className 
}: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Initialize map when component mounts
    if (!mapRef.current) return;

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('Google Maps API key is missing. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file.');
      if (mapRef.current) {
        mapRef.current.innerHTML = '<div style="color: red; padding: 1em;">Google Maps API key is missing. Please contact the site administrator.</div>';
      }
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = initMap;
    document.head.appendChild(script);

    function initMap() {
      if (!mapRef.current) return;
      
      try {
        // Create the map instance
        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          center: { lat: latitude, lng: longitude },
          zoom: zoom,
          disableDefaultUI: true,
          styles: [
            {
              "elementType": "geometry",
              "stylers": [{ "color": "#242f3e" }]
            },
            {
              "elementType": "labels.text.stroke",
              "stylers": [{ "color": "#242f3e" }]
            },
            {
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#746855" }]
            },
            {
              "featureType": "administrative.locality",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#d59563" }]
            },
            {
              "featureType": "poi",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#d59563" }]
            },
            {
              "featureType": "poi.park",
              "elementType": "geometry",
              "stylers": [{ "color": "#263c3f" }]
            },
            {
              "featureType": "poi.park",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#6b9a76" }]
            },
            {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [{ "color": "#38414e" }]
            },
            {
              "featureType": "road",
              "elementType": "geometry.stroke",
              "stylers": [{ "color": "#212a37" }]
            },
            {
              "featureType": "road",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#9ca5b3" }]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry",
              "stylers": [{ "color": "#746855" }]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry.stroke",
              "stylers": [{ "color": "#1f2835" }]
            },
            {
              "featureType": "road.highway",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#f3d19c" }]
            },
            {
              "featureType": "transit",
              "elementType": "geometry",
              "stylers": [{ "color": "#2f3948" }]
            },
            {
              "featureType": "transit.station",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#d59563" }]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [{ "color": "#17263c" }]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#515c6d" }]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.stroke",
              "stylers": [{ "color": "#17263c" }]
            }
          ]
        });

        // Add user location marker
        new google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: mapInstanceRef.current,
          title: 'Your Location',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillOpacity: 1,
            fillColor: '#EF4444',
            strokeWeight: 2,
            strokeColor: '#FFFFFF',
          }
        });

        // Add additional markers
        markers.forEach(marker => {
          new google.maps.Marker({
            position: { lat: marker.lat, lng: marker.lng },
            map: mapInstanceRef.current,
            title: marker.title,
            icon: marker.icon,
          });
        });
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [latitude, longitude, zoom]);

  // Update map when position changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude]);

  return (
    <div 
      ref={mapRef} 
      className={`w-full h-full rounded-lg overflow-hidden ${className || ''}`}
    />
  );
}

export default LocationMap;
