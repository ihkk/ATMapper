import './App.css';
import Map from './Map';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState, useEffect, useRef } from 'react';
import GeoPoint from './components/GeoPoint';
import 'mapbox-gl/dist/mapbox-gl.css'
import axios from 'axios';
import html2canvas from 'html2canvas';
import wrapText from './components/WrapText';


function App() {
  // geo points saved in the state
  const [geoPoints, setGeoPoints] = useState([]);
  const [obtainedPoints, setObtainedPoints] = useState([]);

  // for search box
  const [searchResults, setSearchResults] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [keyword, setKeyword] = useState('');
  const timerId = useRef(null);
  const dropdownRef = useRef(null);

  // for drag and drop
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);



  useEffect(() => {
    const savedObtainedPoints = localStorage.getItem('obtainedPoints');
    const savedGeoPoints = localStorage.getItem('geoPoints');
    if (savedObtainedPoints) {
      setObtainedPoints(JSON.parse(savedObtainedPoints));
    }
    if (savedGeoPoints) {
      setGeoPoints(JSON.parse(savedGeoPoints));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);


  // function allowing users to add a new geo point to the state
  const addGeoPoint = (newGeoPoint) => {
    setGeoPoints([...geoPoints, newGeoPoint]);
    setObtainedPoints(currentPoints => currentPoints.filter(p => p !== newGeoPoint));
  }


  // obtain points from Anitabi
  const obtainPoints = async () => {
    if (!selectedId) return;
    const id = selectedId;
    const response = await axios.get(`https://api.anitabi.cn/bangumi/${id}/points/detail`);
    const newObtainedPoints = response.data.map(point => {
      return new GeoPoint(
        point.name,      // posName
        selectedAnime,   // animeName
        point.geo[0],    // latitude
        point.geo[1],    // longitude
        point.image,     // pic
        point.ep,        // ep
        point.s,         // s
      );
    });
    setObtainedPoints(newObtainedPoints);
  }

  // save obtainedPoints and geoPoints to local storage
  useEffect(() => {
    // if empty, do not save
    if (obtainedPoints.length === 0 && geoPoints.length === 0) return;
    localStorage.setItem('obtainedPoints', JSON.stringify(obtainedPoints));
    localStorage.setItem('geoPoints', JSON.stringify(geoPoints));
    console.log('saved to local storage');
  }, [obtainedPoints, geoPoints]);





  const search = async () => {
    if (!keyword.trim()) return;
    try {
      const response = await axios.get(`https://api.bgm.tv/search/subject/${keyword}?type=2`);
      setSearchResults(response.data.list || []);
      setShowDropdown(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleChange = (event) => {
    setKeyword(event.target.value);
  };

  useEffect(() => {
    if (timerId.current) clearTimeout(timerId.current);
    timerId.current = setTimeout(() => {
      search();
    }, 500); // 500ms delay

    return () => clearTimeout(timerId.current);
  }, [keyword]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      clearTimeout(timerId.current);
      search();
    }
  };

  // if the selectedId changes, obtain points
  useEffect(() => {
    if (selectedId) {
      obtainPoints();
    }
  }, [selectedId]);



  // load obtainedPoints and geoPoints from local storage when the component mounts
  useEffect(() => {
    const obtainedPoints = JSON.parse(localStorage.getItem('obtainedPoints')) || [];
    const geoPoints = JSON.parse(localStorage.getItem('geoPoints')) || [];
    setObtainedPoints(obtainedPoints.map(point => new GeoPoint(point.posName, point.animeName, point.latitude, point.longitude, point.pic, point.ep, point.s)));
    setGeoPoints(geoPoints.map(point => new GeoPoint(point.posName, point.animeName, point.latitude, point.longitude, point.pic, point.ep, point.s)));
    console.log('loaded from local storage');
  }, []);

  const download = () => {
    html2canvas(document.querySelector('.mapboxgl-map')).then(firstCanvas => {
      // create the second canvas to list all locations
      const secondCanvas = document.createElement('canvas');
      secondCanvas.width = 210; // 设置为所需的尺寸
      secondCanvas.height = firstCanvas.height;
      const ctx2 = secondCanvas.getContext('2d');

      // draw a white background
      ctx2.fillStyle = 'white';
      ctx2.fillRect(0, 0, 210, firstCanvas.height);

      let startY = 30;
      // list all locations in the second canvas
      geoPoints.forEach((geoPoint, index) => {
        let text = `${index + 1}. ${geoPoint.getPosName()}`;
        ctx2.font = '20px Arial';
        ctx2.fillStyle = 'black';
        startY = wrapText(ctx2, text, 10, startY, 190, 30) + 10;
      });

      // create a combined canvas
      const combinedCanvas = document.createElement('canvas');
      combinedCanvas.width = firstCanvas.width + secondCanvas.width;
      combinedCanvas.height = Math.max(firstCanvas.height, secondCanvas.height);
      const ctxCombined = combinedCanvas.getContext('2d');

      // combine the two canvases
      ctxCombined.drawImage(firstCanvas, 0, 0);
      ctxCombined.drawImage(secondCanvas, firstCanvas.width, 0);

      // download the combined canvas
      const link = document.createElement('a');
      link.download = 'combined.png';
      link.href = combinedCanvas.toDataURL();
      link.click();
    });
  }



  return (
    <div>
      {/* three rows */}
      <div className="container-fluid">
        <div className="row align-items-center m-2">

          <div className="col-md-2">
            <h2>AT Planner</h2>
          </div>
          <div className="col col-md-8 position-relative">
            <div className='row'>
              <div className="input-group">
                <input type="text" className="form-control" placeholder="搜索作品" value={keyword} onChange={handleChange} onKeyDown={handleKeyDown} />
                <button className="btn btn-secondary" type="button" onClick={search}><i class="bi bi-search"></i>
                </button>
              </div>
            </div>
            {showDropdown && (
              <div className='row' ref={dropdownRef}>
                <div className="col">
                  <div className="list-group position-absolute w-100" style={{ zIndex: 1050, maxHeight: '300px', overflowY: 'auto', top: 'calc(100% - 1px)', paddingRight: '23px', }}>
                    {searchResults.map((item) => (
                      <div key={item.id}
                        className="list-group-item list-group-item-action d-flex gap-3 py-2 align-items-center"
                        aria-current="true"
                        onClick={() => {
                          setSelectedId(item.id);
                          setShowDropdown(false);
                          setSelectedAnime(item.name_cn);
                        }}>
                        <img src={item.images ? item.images.grid : ''} alt={item.name} className="d-flex align-self-center" style={{ width: '30px', height: '30px' }} />
                        <div className="d-flex align-items-center text-truncate" style={{ maxWidth: 'calc(100% - 60px)' }}>
                          <span className="text-truncate">{item.name_cn || item.name} {item.name_cn ? `(${item.name})` : ''}</span>
                        </div>
                      </div>

                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="col-md-2">
            {(geoPoints.length > 0 || obtainedPoints.length > 0) &&
              <button className="btn btn-danger" onClick={() => { setGeoPoints([]); setObtainedPoints([]) }}><i class="bi bi-arrow-clockwise"></i></button>}
            {/* download button */}
            {geoPoints.length > 0 && <button className="btn btn-success ms-2" onClick={download}><i class="bi bi-download"></i></button>}
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
                    <button className="btn btn-primary ms-auto"
                      onClick={() => {
                        addGeoPoint(obtainedPoint);
                      }}><i class="bi bi-plus-square"></i></button>
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
            {/* <div className='row'>
              <div className="col-md-12">
                <h4 className="text-center">Selected Points</h4>
              </div>
            </div> */}


            <div className='row'>
              <div className="col-md-12">

                {/* a sortable list to display geoPoints with delete botton*/}
                <ul className="list-group overflow-auto" style={{ maxHeight: '700px' }}>
                  {geoPoints.map((geoPoint, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex align-items-center draggable-item"
                      draggable="true"
                      onDragStart={() => setDraggedIndex(index)}
                      onDragOver={(e) => {
                        e.preventDefault(); // 防止默认处理拖拽结果（比如打开链接）
                        setOverIndex(index);
                      }}
                      onDrop={() => {
                        // 执行交换逻辑
                        const newGeoPoints = Array.from(geoPoints);
                        const draggedItem = newGeoPoints.splice(draggedIndex, 1)[0];
                        newGeoPoints.splice(overIndex, 0, draggedItem);
                        setGeoPoints(newGeoPoints);

                        // 更新obtainedPoints
                        setObtainedPoints(prevObtainedPoints => [...prevObtainedPoints, geoPoints[draggedIndex]]);
                      }}
                    >
                      <span className="badge bg-secondary me-3">{index + 1}</span>
                      <span className="flex-grow-1">{geoPoint.getPosName()}</span>
                      <button
                        className="btn btn-danger ms-auto"
                        onClick={() => {
                          const deletedGeoPoint = geoPoints[index];
                          setGeoPoints(geoPoints.filter((_, i) => i !== index));
                          setObtainedPoints(prevObtainedPoints => [...prevObtainedPoints, deletedGeoPoint]);
                        }}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </li>
                  ))}
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
