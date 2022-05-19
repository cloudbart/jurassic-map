import React, { useEffect, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';
import './MapInterface.css';
import Canvas from './Canvas';
import { API, graphqlOperation } from 'aws-amplify';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

const initialMapMarkersState = [{
    "id": "vehicle01",
    "tourState": "idle",
    "xcoord": "884",
    "ycoord": "828"
  },
  {
    "id": "vehicle02",
    "tourState": "idle",
    "xcoord": "884",
    "ycoord": "828"
  },
  {
    "id": "vehicle03",
    "tourState": "idle",
    "xcoord": "884",
    "ycoord": "828"
  }
];

//Class to render the overall map interface
const MapInterface = () => {
  const [mapMarkers, setMapMarkers] = useState(initialMapMarkersState);
  const [dataLoaded, setDataLoaded] = useState([false]);
  const [tours, setTours] = useState([]);

  //Refresh mapMarkers every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMapMarkers();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  //Function to retrieve data from AppSync
  async function fetchMapMarkers() {
    try {
      let markerArrayData = await API.graphql(graphqlOperation(queries.listMapMarkers));
      let markerArray = markerArrayData.data.listMapMarkers.items;
      setMapMarkers(markerArray);
      setDataLoaded(true);
    }
    catch (err) { console.log('graphql error fetching mapMarkers') }
  }

  //Function to request new tour
  async function startTour(vehicleId) {
    try {
      console.log("Start tour: " + vehicleId);
      //Prepare startTour request details, randomize tour route
      var tourDetails = { vehicleId: vehicleId, routeId: 'fullTour' };
      var random_boolean = Math.random() < 0.6;
      if (random_boolean) {
        tourDetails = { vehicleId: vehicleId, routeId: 'shortTour' };
      }
      console.log(tourDetails);
      setTours([...tours, tourDetails]);
      try {
        const tourResponse = await API.graphql(graphqlOperation(mutations.startTour, tourDetails));
        setTours([...tours, tourResponse]);
        console.log(tourResponse);
      }
      catch (err) {
        console.log("Failed tourRequest call");
        console.log(err);
      }
    }
    catch (err) {
      console.log("Failed tourRequest call");
      console.log(err);
    }
  }

  // Function to handle click event
  function handleClick(i) {
    let vehicleId = "vehicle0" + (i + 1);
    let currentMarker = mapMarkers.find(item => item.id === vehicleId);
    if (currentMarker.tourState !== "idle") {
      console.log(vehicleId + " active: " + currentMarker.tourState);
    }
    else {
      //Call startTour mutation
      startTour(vehicleId);
    }
  }

  //Function to render a tour vehicle button
  function TourVehicleButton(props) {
    let vehicleNumber = Number(props.value) + 1;
    return (
      <div className="tourVehicleButton">
      <img src='jurassicmap_tourVehicle_25x59.png'
        onClick={props.onClick}
        alt="JurassicMap tour vehicle button"
        style={{ filter: (props.buttonStyle) }}
      /><p>0{vehicleNumber}</p>
    </div>
    );
  }

  //Function to render tour vehicle buttons
  function renderVehicleButton(i) {
    if (dataLoaded === true) {
      let vehicleId = "vehicle0" + (i + 1); //Construct vehicleId from index
      let currentMarker = mapMarkers.find(item => item.id === vehicleId); //find current vehicle
      let buttonStyle = "drop-shadow(0 0 0 white)"; //Set default drop shadow color
      if (currentMarker.tourState !== "idle") { buttonStyle = "drop-shadow(0 0 3px white)" }
      return (
        <TourVehicleButton 
          buttonStyle = {buttonStyle}
          value={[i]}
          onClick={() => handleClick(i)}
        />
      );
    } else {
      return (<p>loading</p>);
    }
  }

  //Marker-drawing function
  function drawMarker(ctx, markerId, frameCount) {
    //Try to find current map marker in fetched mapMarkers array
    try {
      let currentMarker = mapMarkers.find(item => item.id === markerId);
      //Reset visibility, check for visbility of current marker
      var visible = true;
      if (currentMarker.tourState === "idle") { visible = false; return }
      //Begin drawing context setup
      ctx.lineWidth = 2;
      ctx.beginPath();
      //If frameCount is defined, marker should be animated
      if (typeof frameCount != "undefined" && visible) {
        ctx.arc(currentMarker.xcoord, currentMarker.ycoord, 8 * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI, false);
      }
      //If frameCount is undefined, then marker should not be animated
      else if (visible) {
        ctx.arc(currentMarker.xcoord, currentMarker.ycoord, 5, 0, 2 * Math.PI, false);
      }
      ctx.fillStyle = currentMarker.color;
      ctx.fill();
    }
    catch (err) { console.log(markerId + 'not found') }
  }

  //Function to draw on canvas
  const draw = (ctx, frameCount) => {
    if (dataLoaded === true) {
      drawMarker(ctx, 'raptor01'); // Raptor 1
      drawMarker(ctx, 'raptor02'); // Raptor 2
      drawMarker(ctx, 'raptor03'); // Raptor 3
      drawMarker(ctx, 'rex01'); // TRex 1
      drawMarker(ctx, 'dilo01'); // Dilophosaur 1
      drawMarker(ctx, 'procerat01'); // Proceratosaur 1
      drawMarker(ctx, 'bary01'); // Baryonyx 1
      drawMarker(ctx, 'metricanth01'); // Metricanthosaurus 1
      drawMarker(ctx, 'trike01'); // Triceratops 1
      drawMarker(ctx, 'trike02'); // Triceratops 2
      drawMarker(ctx, 'trike03'); // Triceratops 3
      drawMarker(ctx, 'parasaur01'); // Parasaurolophus 1
      drawMarker(ctx, 'parasaur02'); // Parasaurolophus 2
      drawMarker(ctx, 'parasaur03'); // Parasaurolophus 3
      drawMarker(ctx, 'brachi01'); // Brachiosaurus 1
      drawMarker(ctx, 'brachi02'); // Brachiosaurus 2
      drawMarker(ctx, 'brachi03'); // Brachiosaurus 3
      drawMarker(ctx, 'gallimimus01'); // Gallimimus 1
      drawMarker(ctx, 'gallimimus02'); // Gallimimus 2
      drawMarker(ctx, 'gallimimus03'); // Gallimimus 3
      drawMarker(ctx, 'gallimimus04'); // Gallimimus 4
      drawMarker(ctx, 'gallimimus05'); // Gallimimus 5
      drawMarker(ctx, 'gallimimus06'); // Gallimimus 6
      drawMarker(ctx, 'gallimimus07'); // Gallimimus 7
      drawMarker(ctx, 'gallimimus08'); // Gallimimus 8
      drawMarker(ctx, 'gallimimus09'); // Gallimimus 9
      drawMarker(ctx, 'segi01'); // Segisaurus 1
      drawMarker(ctx, 'segi02'); // Segisaurus 2
      drawMarker(ctx, 'segi03'); // Segisaurus 3
      drawMarker(ctx, 'segi04'); // Segisaurus 4
      drawMarker(ctx, 'segi05'); // Segisaurus 5
      drawMarker(ctx, 'segi06'); // Segisaurus 6
      drawMarker(ctx, 'vehicle01', frameCount); // Vehicle 1
      drawMarker(ctx, 'vehicle02', frameCount); // Vehicle 2
      drawMarker(ctx, 'vehicle03', frameCount); // Vehicle 3 
      drawMarker(ctx, 'boat01', frameCount); // Boat 01
      drawMarker(ctx, 'helicopter01', frameCount); // Helicopter 01 
    }
    else {
      console.log("Loading Map Data");
    }
  };

  return (
    <>
      <div className="mapTableMap">
        <div className="tourVehicleInterface">
          {renderVehicleButton(0)}
          {renderVehicleButton(1)}
          {renderVehicleButton(2)}
        </div>
        <TransformWrapper>
          {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
            <React.Fragment>
              <div className="mapZoomControls">
                <button className="mapZoomControlBtn" title="Zoom Out" onClick={() => zoomOut()}>-</button>
                <button className="mapZoomControlBtn" title="Reset" onClick={() => resetTransform()}>Reset</button>
                <button className="mapZoomControlBtn" title="Zoom In" onClick={() => zoomIn()}>+</button>
              </div>
              <TransformComponent>
                <Canvas className="map-image" draw={draw} width="2261" height="2492" alt="InteractiveParkMap"/>
              </TransformComponent>
            </React.Fragment>
          )}
        </TransformWrapper>
      </div>
    </>
  );
};

export default MapInterface;