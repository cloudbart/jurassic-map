import React, { useEffect, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';
import MapTableSidePanel from './MapTableSidePanel';
import MapTableIndexPanel from './MapTableIndexPanel';
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
    console.log("Start tour: " + vehicleId);
    //Prepare startTour request details, randomize tour route
    var tourDetails = { vehicleId: vehicleId, routeId: 'fullTour' };
    var random_boolean = Math.random() < 0.6;
    if (random_boolean) {
      tourDetails = { vehicleId: vehicleId, routeId: 'shortTour' };
    }
    try {
      const tourResponse = await API.graphql(graphqlOperation(mutations.startTour, tourDetails));
      setTours([...tours, tourResponse]);
    }
    catch (err) {
      console.log("Failed tourRequest call");
      console.log(err);
    }
  }

  // Function to handle click event
  function handleVehicleClick(i) {
    let vehicleId = "vehicle0" + (i + 1);
    let currentMarker = mapMarkers.find(item => item.id === vehicleId);
    //Check clicked-vehicle tour-state, request tour if idle
    if (currentMarker.tourState === "idle") {
      startTour(vehicleId); //Call startTour mutation
    }
  }

  //Function to render a tour vehicle button
  const TourVehicleButton = params => {
    if (dataLoaded === true) {
      let vehicleId = "vehicle0" + (params.i + 1); //Construct vehicleId from index
      let currentMarker = mapMarkers.find(item => item.id === vehicleId); //find current vehicle
      //If vehicle is idle, set default mapWindow factor
      if (currentMarker.tourState === "idle") {
        let xfactor = 1.85;
        let yfactor = 1.7;
        var mapWindowX = (0 - (currentMarker.xcoord * xfactor));
        var mapWindowY = (0 - (currentMarker.ycoord * yfactor));
      }
      //If vehicle is active on tour, adjust mapWindow factor
      else {
        //Calculate mapWindow x coords
        let xratio = (currentMarker.xcoord / 2261);
        let xfactor, yfactor;
        switch (true) {
          case ((xratio > .49) && (xratio < .59)):
            xfactor = 1.93;
            break;
          case ((xratio > .59) && (xratio < .69)):
            xfactor = 1.98;
            break;
          case ((xratio > .69) && (xratio < .79)):
            xfactor = 2.01;
            break;
          case (xratio > .79):
            xfactor = 2.05;
            break;
          default:
            xfactor = 1.87;
            break;
        }
        //Calculate mapWindow y coords
        let yratio = (currentMarker.ycoord / 2492);
        switch (true) {
          case ((yratio > .24) && (yratio < .32)):
            yfactor = 1.65;
            break;
          case ((yratio > .32) && (yratio < .40)):
            yfactor = 1.75;
            break;
          case ((yratio > .40) && (yratio < .48)):
            yfactor = 1.85;
            break;
          case ((yratio > .48) && (yratio < .54)):
            yfactor = 1.9;
            break;
          case (yratio > .54):
            yfactor = 1.95;
            break;
          default:
            yfactor = 1.53;
            break;
        }
        mapWindowX = (0 - (currentMarker.xcoord * xfactor));
        mapWindowY = (0 - (currentMarker.ycoord * yfactor));
      }
      //Return idle vehicle button elements
      if (currentMarker.tourState === "idle") {
        let buttonStyle = "drop-shadow(0 0 0px white)";
        return (
          <div className="tourVehicleButton">
            <img src='jurassicmap_tour_vehicle_32x75.png'
              onClick={() => { handleVehicleClick(params.i); params.setTransform(mapWindowX,mapWindowY,7,1300,"easeOut"); }}
              alt="JurassicMap tour vehicle button"
              style={{ filter: (buttonStyle) }}
            />
            <p>0{params.i + 1}</p>
          </div>
        );
      }
      //Return active tour vehicle button elements
      else {
        let buttonStyle = "drop-shadow(0 0 6px white)";
        return (
          <div className="tourVehicleButton">
            <img src='jurassicmap_tour_vehicle_32x75.png'
              onClick={() => { handleVehicleClick(params.i); params.setTransform(mapWindowX,mapWindowY,7,1300,"easeOut"); }}
              alt="JurassicMap tour vehicle button"
              style={{ filter: (buttonStyle) }}
            />
            <p>0{params.i + 1}<br/>Active</p>
          </div>
        );
      }
    }
    //Return temporary loading message
    else {
      return (<div className="tourVehicleButton">loading</div>);
    }
  };

  //mapMarker-drawing function
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
        <TransformWrapper>
          {({ zoomIn, zoomOut, resetTransform, setTransform, ...rest }) => (
            <React.Fragment>
              <MapTableSidePanel/>
              <MapTableIndexPanel/>
              <div className="tourVehicleInterface">
                <TourVehicleButton i={0} setTransform={setTransform} />
                <TourVehicleButton i={1} setTransform={setTransform} />
                <TourVehicleButton i={2} setTransform={setTransform} />
              </div>
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