import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import './Map.css';

mapboxgl.accessToken =
    'pk.eyJ1IjoiaWhrayIsImEiOiJjbHVkZWRlMG8xYWFsMmxxbnAxMm9yZ3U3In0.vz0G2accFeSOiZnLVBzsIw';

function Map({ geoPoints }) {
    const mapContainerRef = useRef(null);

    const [lng, setLng] = useState(140);
    const [lat, setLat] = useState(39);
    const [zoom, setZoom] = useState(4.5);
    const [lang, setLang] = useState('zh-Hans');

    // Initialize map when component mounts
    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/ihkk/clufvac8l00tw01pib4ek0884',
            language: lang,
            center: [lng, lat],
            zoom: zoom,
            projection: 'mercator'
        });

        // Add navigation control (the +/- zoom buttons)
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        map.on('move', () => {
            setLng(map.getCenter().lng.toFixed(4));
            setLat(map.getCenter().lat.toFixed(4));
            setZoom(map.getZoom().toFixed(2));
        });

        const language = new MapboxLanguage();
        map.addControl(language);
        map.on('load', function () {
            map.resize();

            if (geoPoints && geoPoints.length > 0) {
                geoPoints.forEach(point => {
                    new mapboxgl.Marker()
                        .setLngLat([point.getLongitude(), point.getLatitude()])
                        .setPopup(new mapboxgl.Popup({ offset: 25 })
                            .setText(`${point.getPosName()}: ${point.getAnimeName()}`))
                        .addTo(map);
                    console.log(`Position Name: ${point.getPosName()}, Anime Name: ${point.getAnimeName()}, Coordinates: (${point.getLatitude()}, ${point.getLongitude()})`);
                });
            }
        });


        // Clean up on unmount
        return () => map.remove();
    }, [geoPoints, lang]);

    return (
        <div>
            <div id="map" ref={mapContainerRef} />
        </div>
    );
};



export default Map;