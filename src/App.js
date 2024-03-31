import './App.css';
import Map from './Map';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import GeoPoint from './components/GeoPoint';
import 'mapbox-gl/dist/mapbox-gl.css'
import axios from 'axios';

function App() {
  // geo points saved in the state
  const [geoPoints, setGeoPoints] = useState([]);
  const [obtainedPoints, setObtainedPoints] = useState([]);

  // function allowing users to add a new geo point to the state
  const addGeoPoint = (newGeoPoint) => {
    setGeoPoints([...geoPoints, newGeoPoint]);
    setObtainedPoints(currentPoints => currentPoints.filter(p => p !== newGeoPoint));
  }


  // obtain points from Anitabi
  const obtainPoints = async () => {
    const response = await axios.get('https://api.anitabi.cn/bangumi/277518/points/detail');
    const newObtainedPoints = response.data.map(point => {
      return new GeoPoint(

        point.name,      // posName
        "GIVEN",         // animeName
        point.geo[0],    // latitude
        point.geo[1],    // longitude
        point.image,     // pic
        point.ep,        // ep
        point.s,         // s
      );
    });

    setObtainedPoints(newObtainedPoints);
  }


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
    obtainPoints();
    // addDemoData();
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

          <div className="col-md-2">
            {/* display all points from obtainedPoints and allow users to add them to newObtainedPoints*/}
            <ul className="list-group overflow-auto" style={{ maxHeight: '700px' }}>
              {obtainedPoints.map((obtainedPoint, index) => {
                return (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-start">
                    {obtainedPoint.getPosName()}
                    <button className="btn btn-primary ms-auto" onClick={() => addGeoPoint(obtainedPoint)}>Add</button>
                  </li>
                );
              })}
            </ul>

          </div>

          <div className="col-md-8 ">
            <Map geoPoints={geoPoints} />
          </div>

          <div className="col-md-2">
            {/* title */}
            <div className='row'>
              <div className="col-md-12">
                <h4 className="text-center">Selected Points</h4>
              </div>
            </div>
            <div className='row'>
              <div className="col-md-12">
                {geoPoints.length > 0 &&
                  <button className="btn btn-danger" onClick={() => setGeoPoints([])}>Clear All</button>}
              </div>
            </div>

            <div className='row'>
              <div className="col-md-12">

                {/* a sortable list to display geoPoints with delete botton*/}
                <ul className="list-group overflow-auto" style={{ maxHeight: '700px' }}>
                  {geoPoints.map((geoPoint, index) => {
                    return (
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-start">
                        {geoPoint.getPosName()}
                        <button className="btn btn-danger ms-auto" onClick={() => setGeoPoints(geoPoints.filter((point, i) => i !== index))}>Delete</button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
