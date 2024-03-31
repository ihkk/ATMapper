import './App.css';
import Map from './Map';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import GeoPoint from './components/GeoPoint';
import 'mapbox-gl/dist/mapbox-gl.css'


function App() {
  // geo points saved in the state
  const [geoPoints, setGeoPoints] = useState([]);

  // add demo data to the state
  const addDemoData = () => {
    const geoPoints = [
      new GeoPoint("Tokyo Tower", "One Piece", 35.6586, 139.7454),
      new GeoPoint("Akihabara", "Steins;Gate", 35.7024, 139.7743),
      new GeoPoint("Shibuya Crossing", "Tokyo Ghoul", 35.6618, 139.7041),
      new GeoPoint("Odaiba", "Psycho-Pass", 35.6190, 139.7798),
      new GeoPoint("Ueno Park", "Shirobako", 35.7156, 139.7732)
    ];
    setGeoPoints(geoPoints);
  }

  // initialize the state with demo data when the component is mounted
  useState(() => {
    addDemoData();
  }, []);


  return (
    <div>
      {/* three rows */}
      <div className="row">
        <div className="row">

          <div className="col-md-12">
            <h1 className="text-center">AT Planner</h1>
          </div>
        </div>

        <div className="row">
          <div className="col-md-2 "></div>
          <div className="col-md-8 ">
            <Map geoPoints={geoPoints} />
          </div>

          <div className="col-md-2">
            {/* a sortable list to display  geoPoints*/}
            <ul className="list-group">
              {geoPoints.map((geoPoint, index) => {
                return (
                  <li key={index} className="list-group-item">
                    {geoPoint.getPosName()}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
