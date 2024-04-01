import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import './Map.css';

mapboxgl.accessToken =
    'pk.eyJ1IjoiaWhrayIsImEiOiJjbHVkZWRlMG8xYWFsMmxxbnAxMm9yZ3U3In0.vz0G2accFeSOiZnLVBzsIw';

function Map({ geoPoints, lang }) {
    const mapContainerRef = useRef(null);

    const [lng, setLng] = useState(140);
    const [lat, setLat] = useState(39);
    const [zoom, setZoom] = useState(4.5);

    // Initialize map when component mounts
    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/ihkk/clufvac8l00tw01pib4ek0884',
            language: lang,
            center: [lng, lat],
            zoom: zoom,
            projection: 'mercator',
            preserveDrawingBuffer: true
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
            if (geoPoints && geoPoints.length > 0) {
                geoPoints.forEach((point, index) => {
                    // create a DOM element for the marker
                    const el = document.createElement('div');
                    el.className = 'custom-marker';
                    el.innerHTML = `<span class="marker-number">${index + 1}</span>`; // 使用 index 来生成数字

                    // set marker style
                    el.style.width = '30px';
                    el.style.height = '30px';
                    el.style.borderRadius = '50%';
                    el.style.backgroundColor = 'white';
                    el.style.border = '4px solid black';
                    el.style.display = 'flex';
                    el.style.alignItems = 'center';
                    el.style.justifyContent = 'center';
                    el.style.color = 'black';
                    el.style.fontSize = '15px';
                    el.style.fontWeight = 'bold';

                    // add marker to map
                    new mapboxgl.Marker(el)
                        .setLngLat([point.getLongitude(), point.getLatitude()])
                        .setPopup(new mapboxgl.Popup({ offset: 20 }) // 添加弹窗
                            .setText(`${point.getPosName()}：${point.getAnimeName()}`))
                        .addTo(map);
                });
            }
        });

        // calculate the center and zoom level of the map
        if (geoPoints && geoPoints.length > 0) {
            const bounds = new mapboxgl.LngLatBounds();
            geoPoints.forEach((point) => {
                bounds.extend([point.getLongitude(), point.getLatitude()]);
            });
            map.fitBounds(bounds, { padding: 50 });
        }

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