import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import './Map.css';

mapboxgl.accessToken =
    'pk.eyJ1IjoiaWhrayIsImEiOiJjbHVkZWRlMG8xYWFsMmxxbnAxMm9yZ3U3In0.vz0G2accFeSOiZnLVBzsIw';

function Map({ geoPoints, tmpPoints, lang, onAddGeoPoint, onDeleteGeoPoint, legendPosition, mapStyle }) {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef([]);

    const [lng, setLng] = useState(140);
    const [lat, setLat] = useState(39);
    const [zoom, setZoom] = useState(4.5);

    // track use interact
    const [userInteracted, setUserInteracted] = useState(false);


    // legend
    const legend = document.createElement('div');
    legend.className = 'mapboxgl-ctrl mapboxgl-ctrl-group legend';
    legend.style.backgroundColor = '#fff';
    legend.style.padding = '10px';
    legend.style.width = '20%';


    const allSameAnime = geoPoints.every((point, _, arr) => point.getAnimeName() === arr[0].getAnimeName());


    // reset user interact
    useEffect(() => {
        let timer;
        if (userInteracted) {
            timer = setTimeout(() => {
                setUserInteracted(false);
            }, 500);
        }

        return () => clearTimeout(timer);
    }, [userInteracted]);

    const handleInteraction = () => {
        setUserInteracted(true);
    };


    // Initialize map when component mounts
    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: mapStyle,
            language: lang,
            center: [lng, lat],
            zoom: zoom,
            projection: 'mercator',
            preserveDrawingBuffer: true
        });


        map.on('move', () => {
            setLng(map.getCenter().lng.toFixed(4));
            setLat(map.getCenter().lat.toFixed(4));
            setZoom(map.getZoom().toFixed(2));
        });

        const language = new MapboxLanguage();
        map.addControl(language);
        mapRef.current = map;
        return () => map.remove();
    }, [lang, mapStyle]);

    // update marker and legend
    useEffect(() => {
        const map = mapRef.current;

        if (!map || !geoPoints || !tmpPoints) return;

        // clear all markers and legend
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        let legend = document.querySelector('.legend');
        if (legend) {
            legend.remove();
        }

        // add markers for tmpPoints
        tmpPoints.forEach(point => {
            const el = document.createElement('div');
            el.innerHTML = '<i class="bi bi-geo-alt-fill" style="color: #17a2b8; font-size: 24px;"></i>';
            el.style.cursor = 'pointer';
            el.addEventListener('click', () => {
                onAddGeoPoint(point);
                setUserInteracted(true);
            });

            const marker = new mapboxgl.Marker(el)
                .setLngLat([point.getLongitude(), point.getLatitude()])
                .addTo(map);
            markersRef.current.push(marker);
        });

        // add markers for geoPoints
        geoPoints.forEach((point, index) => {
            const el = document.createElement('div');
            el.className = 'custom-marker';
            el.innerHTML = `<span class="marker-number">${index + 1}</span>`;

            el.style = `
                width: 20px; height: 20px; border-radius: 50%;
                background-color: black; display: flex; align-items: center;
                justify-content: center; color: white; font-size: 12px;
                font-weight: bold; cursor: pointer;`;

            el.addEventListener('click', () => {
                onDeleteGeoPoint(point);
                setUserInteracted(true);
            });

            const marker = new mapboxgl.Marker(el)
                .setLngLat([point.getLongitude(), point.getLatitude()])
                .addTo(map);
            markersRef.current.push(marker);
        });

        // add legend
        if (geoPoints.length > 0 && legendPosition !== 'hide') {
            legend = document.createElement('div');
            legend.className = 'mapboxgl-ctrl mapboxgl-ctrl-group legend';
            legend.style.position = 'absolute';
            legend.style.backgroundColor = '#fff';
            legend.style.padding = '10px';
            legend.style.width = '20%';

            switch (legendPosition) {
                case 'top-left':
                    legend.style.top = '10px';
                    legend.style.left = '10px';
                    break;
                case 'bottom-left':
                    legend.style.bottom = '10px';
                    legend.style.left = '10px';
                    break;
                case 'top-right':
                    legend.style.top = '10px';
                    legend.style.right = '10px';
                    break;
                case 'bottom-right':
                    legend.style.bottom = '10px';
                    legend.style.right = '10px';
                    break;
                default:
                    legend.style.bottom = '10px';
                    legend.style.right = '10px';
                    break;
            }

            geoPoints.forEach((point, index) => {
                const item = document.createElement('div');
                const textContent = allSameAnime ?
                    `${index + 1}：${point.getPosName()}` :
                    `${index + 1}：${point.getPosName()} [${point.getAnimeName()[0]}]`;
                item.textContent = textContent;
                legend.appendChild(item);
            });
            map.getContainer().appendChild(legend);
            map.resize();
        }
        // calculate the center and zoom level of the map from both geoPoints and tmpPoints
        if (!userInteracted && (geoPoints.length > 0 || tmpPoints.length > 0)) {
            const bounds = new mapboxgl.LngLatBounds();
            geoPoints.forEach(point => bounds.extend([point.getLongitude(), point.getLatitude()]));
            tmpPoints.forEach(point => bounds.extend([point.getLongitude(), point.getLatitude()]));
            map.fitBounds(bounds, { padding: 50 });
        }
    }, [geoPoints, tmpPoints, lang, legendPosition, mapStyle]);

    return (
        <div id="map-container">
            <div id="map" ref={mapContainerRef} />
        </div>
    );
};



export default Map;