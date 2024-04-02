import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import './Map.css';

mapboxgl.accessToken =
    'pk.eyJ1IjoiaWhrayIsImEiOiJjbHVkZWRlMG8xYWFsMmxxbnAxMm9yZ3U3In0.vz0G2accFeSOiZnLVBzsIw';

function Map({ geoPoints, tmpPoints, lang, onAddGeoPoint, legendPosition }) {
    const mapContainerRef = useRef(null);

    const [lng, setLng] = useState(140);
    const [lat, setLat] = useState(39);
    const [zoom, setZoom] = useState(4.5);

    // legend
    const legend = document.createElement('div');
    legend.className = 'mapboxgl-ctrl mapboxgl-ctrl-group legend';
    legend.style.backgroundColor = '#fff';
    legend.style.padding = '10px';
    legend.style.width = '20%';


    const allSameAnime = geoPoints.every((point, _, arr) => point.getAnimeName() === arr[0].getAnimeName());

    geoPoints.forEach((point, index) => {
        const item = document.createElement('div');
        const textContent = allSameAnime ?
            `${index + 1}：${point.getPosName()}` :
            `${index + 1}：${point.getPosName()} [${point.getAnimeName()[0]}]`;
        item.textContent = textContent;
        legend.appendChild(item);
    });



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
            if (tmpPoints && tmpPoints.length > 0) {
                tmpPoints.forEach((point) => {
                    const el = document.createElement('div');
                    el.innerHTML = '<i class="bi bi-geo-alt-fill" style="color: #17a2b8; font-size: 24px;"></i>';
                    el.style.cursor = 'pointer';
                    // listener to add point to the list
                    el.addEventListener('click', () => onAddGeoPoint(point));


                    new mapboxgl.Marker(el)
                        .setLngLat([point.getLongitude(), point.getLatitude()])
                        .addTo(map);
                });
            };
            if (geoPoints && geoPoints.length > 0) {
                geoPoints.forEach((point, index) => {
                    // create a DOM element for the marker
                    const el = document.createElement('div');
                    el.className = 'custom-marker';
                    el.innerHTML = `<span class="marker-number">${index + 1}</span>`;

                    // set marker style
                    el.style.width = '20px';
                    el.style.height = '20px';
                    el.style.borderRadius = '50%';
                    el.style.backgroundColor = 'black';
                    el.style.display = 'flex';
                    el.style.alignItems = 'center';
                    el.style.justifyContent = 'center';
                    el.style.color = 'white';
                    el.style.fontSize = '12px';
                    el.style.fontWeight = 'bold';

                    // add marker to map
                    new mapboxgl.Marker(el)
                        .setLngLat([point.getLongitude(), point.getLatitude()])
                        .setPopup(new mapboxgl.Popup({ offset: 20 })
                            .setText(`${point.getPosName()}：${point.getAnimeName()}`))
                        .addTo(map);
                });
            };

            const legendContainer = map.getContainer();
            legendContainer.appendChild(legend);
            legend.style.position = 'absolute';
            switch (legendPosition) {
                case 'top-left':
                    legend.style.top = '10px';
                    legend.style.left = '10px';
                    legend.style.bottom = '';
                    legend.style.right = '';
                    break;
                case 'bottom-left':
                    legend.style.bottom = '10px';
                    legend.style.left = '10px';
                    legend.style.top = '';
                    legend.style.right = '';
                    break;
                case 'top-right':
                    legend.style.top = '10px';
                    legend.style.right = '10px';
                    legend.style.bottom = '';
                    legend.style.left = '';
                    break;
                case 'bottom-right':
                    legend.style.bottom = '10px';
                    legend.style.right = '10px';
                    legend.style.top = '';
                    legend.style.left = '';
                    break;
                case 'hide':
                    legend.style.display = 'none';
                default:
                    // 默认为 bottom-right
                    legend.style.bottom = '10px';
                    legend.style.right = '10px';
                    legend.style.top = '';
                    legend.style.left = '';
                    break;
            }
        });

        // calculate the center and zoom level of the map from both geoPoints and tmpPoints
        if ((geoPoints && geoPoints.length > 0) || (tmpPoints && tmpPoints.length > 0)) {
            const bounds = new mapboxgl.LngLatBounds();

            geoPoints.forEach((point) => {
                bounds.extend([point.getLongitude(), point.getLatitude()]);
            });

            tmpPoints.forEach((point) => {
                bounds.extend([point.getLongitude(), point.getLatitude()]);
            });

            map.fitBounds(bounds, { padding: 50 });
        };

        // Clean up on unmount
        return () => map.remove();
    }, [geoPoints, tmpPoints, lang, legendPosition]);

    return (
        <div>
            <div id="map" ref={mapContainerRef} />
        </div>
    );
};



export default Map;