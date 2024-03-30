import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import './Map.css';

mapboxgl.accessToken =
    'pk.eyJ1IjoiaWhrayIsImEiOiJjbHVkZWRlMG8xYWFsMmxxbnAxMm9yZ3U3In0.vz0G2accFeSOiZnLVBzsIw';

const Map = () => {
    const mapContainerRef = useRef(null);

    const [lng, setLng] = useState(140);
    const [lat, setLat] = useState(39);
    const [zoom, setZoom] = useState(4.5);
    const [lang, setLang] = useState('zh-Hans');

    // Initialize map when component mounts
    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
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

        // Clean up on unmount
        return () => map.remove();
    }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <div className='sidebarStyle'>
                <div>
                    Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                </div>
                <div>
                    Language: {lang} <span>  </span>
                    {lang === "ja" && <button onClick={() => setLang('zh-Hans')}>zh-Hans</button>}
                    {lang === "zh-Hans" && <button onClick={() => setLang('ja')}>ja</button>}
                </div>
            </div>
            <div className='map-container' ref={mapContainerRef} />
        </div>
    );
};



export default Map;