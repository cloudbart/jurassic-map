import React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import * as queries from './graphql/queries';
import './App.css';
import Canvas from './Canvas';
import { API, graphqlOperation } from 'aws-amplify';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

//declare marker variables
let x
let y
let color
let markerArray
let markerArrayStatus = false
let refreshCounter = 0

//Function for retrieving mapMarkers array from AppSync/DDB
const fetchMapMarkers = async function() {
  try {
    let response = await API.graphql(graphqlOperation(queries.listMapMarkers))
    markerArray = response.data.listMapMarkers.items
    console.log("Markers loaded. Rendering...")
    markerArrayStatus = true
    refreshCounter = 0
  }
  catch (err) { console.log('Error fetching mapMarkers') }
}

function App() {
  //Initial call to fetch map markers from datasource
  fetchMapMarkers()
  //Marker-drawing function
  function drawMarker(ctx, markerId, frameCount) {
    markerArray.map((item, index) => {
      Object.entries(item).forEach(([key, value]) => {
        if (item.id === markerId) {
          x = item.xcoord
          y = item.ycoord
          color = item.color
          ctx.lineWidth = 2
          ctx.beginPath()
          //Check if marker should be animated, presence of frameCount value indicates animation
          if (typeof frameCount != "undefined") {
            ctx.arc(x, y, 5 * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI, false)
          }
          //If frameCount is undefined, then the marker should not be animated
          else {
            ctx.arc(x, y, 5, 0, 2 * Math.PI, false)
          }
          ctx.fillStyle = color
          ctx.fill()
        }
      })
      return 0
    })
  }
  //Main call to draw on canvas
  const draw = (ctx, frameCount) => {
    //Check for loaded data status, else wait without drawing anything on the maps
    if (markerArrayStatus) {
      if (refreshCounter >= 300) {
        console.log('Refreshing marker data...')
        fetchMapMarkers()
      }
      else {
        refreshCounter++
        drawMarker(ctx, 'raptor01') // Raptor 1
        drawMarker(ctx, 'raptor02') // Raptor 2
        drawMarker(ctx, 'raptor03') // Raptor 3
        drawMarker(ctx, 'rex01') // TRex 1
        drawMarker(ctx, 'dilo01') // Dilophosaur 1
        drawMarker(ctx, 'procerat01') // Proceratosaur 1
        drawMarker(ctx, 'bary01') // Baryonyx 1
        drawMarker(ctx, 'metricanth01') // Metricanthosaurus 1
        drawMarker(ctx, 'trike01') // Triceratops 1
        drawMarker(ctx, 'trike02') // Triceratops 2
        drawMarker(ctx, 'trike03') // Triceratops 3
        drawMarker(ctx, 'parasaur01') // Parasaurolophus 1
        drawMarker(ctx, 'parasaur02') // Parasaurolophus 2
        drawMarker(ctx, 'parasaur03') // Parasaurolophus 3
        drawMarker(ctx, 'brachi01') // Brachiosaurus 1
        drawMarker(ctx, 'brachi02') // Brachiosaurus 2
        drawMarker(ctx, 'brachi03') // Brachiosaurus 3
        drawMarker(ctx, 'gallimimus01') // Gallimimus 1
        drawMarker(ctx, 'gallimimus02') // Gallimimus 2
        drawMarker(ctx, 'gallimimus03') // Gallimimus 3
        drawMarker(ctx, 'gallimimus04') // Gallimimus 4
        drawMarker(ctx, 'gallimimus05') // Gallimimus 5
        drawMarker(ctx, 'gallimimus06') // Gallimimus 6
        drawMarker(ctx, 'gallimimus07') // Gallimimus 7
        drawMarker(ctx, 'gallimimus08') // Gallimimus 8
        drawMarker(ctx, 'gallimimus09') // Gallimimus 9
        drawMarker(ctx, 'segi01') // Segisaurus 1
        drawMarker(ctx, 'segi02') // Segisaurus 2
        drawMarker(ctx, 'segi03') // Segisaurus 3
        drawMarker(ctx, 'segi04') // Segisaurus 4
        drawMarker(ctx, 'segi05') // Segisaurus 5
        drawMarker(ctx, 'segi06') // Segisaurus 6
        drawMarker(ctx, 'vehicle01', frameCount) // Vehicle 1
        drawMarker(ctx, 'vehicle02', frameCount) // Vehicle 2
        drawMarker(ctx, 'vehicle03', frameCount) // Vehicle 3 
        drawMarker(ctx, 'boat01', frameCount) // Boat 01
        drawMarker(ctx, 'helicopter01', frameCount) // Helicopter 01
      }
    }
    else {
      console.log('Waiting for map markers...')
    }
  }
  return (
    <>
      <div className="App">
        <div className="main">
          <span className="header"><h2>Jurassic Park - Monitoring System</h2></span>
          <div className="map-table">
            <div className="mapTableSidePanel">
              <img src="mapGuideTop_715x345.png" alt="MapLocationsIndex"/>
              <img src="mapGuideMiddle_715x1395.png" alt="DinosaurIndex"/>
              <img src="mapGuideBottom_715x250.png" alt="MapIndex"/>
            </div>
            <div className="mapTableMap">
              <TransformWrapper>
                {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                  <React.Fragment>
                    <div className="mapZoomControls">
                      <button class="mapZoomControlBtn" onClick={() => zoomOut()}>-</button>
                      <button class="mapZoomControlBtn" onClick={() => resetTransform()}>Reset</button>
                      <button class="mapZoomControlBtn" onClick={() => zoomIn()}>+</button>
                    </div>
                    <TransformComponent>
                      <Canvas className="map-image" draw={draw} alt="InteractiveParkMap"/>
                    </TransformComponent>
                  </React.Fragment>
                )}
              </TransformWrapper>
            </div>
          </div>
          <div className="events-table">
            <iframe title="RecentEventsTable" scrolling="no" src="https://cloudwatch.amazonaws.com/dashboard.html?dashboard=JurassicMap-Dashboard&context=eyJSIjoidXMtZWFzdC0xIiwiRCI6ImN3LWRiLTM2MDI1OTcwNDE2MSIsIlUiOiJ1cy1lYXN0LTFfOHdqNkFmY0FuIiwiQyI6IjRiYjN1Y3Y3bW5ocDM3YXJoNG8zMnA3aXMzIiwiSSI6InVzLWVhc3QtMTo2YjUzOGRhMi0zNTI0LTRmMTUtYWIxNS1iMTYxZDg4NzY4MjUiLCJNIjoiUHVibGljIn0="/>
          </div>
          <span className="footer"><p>jurassic-map v.58 - <a href="http://twitter.com/cloudbart">@CloudBart</a> 2022</p></span>
        </div>
      </div>
    </>
  );
}

export default App;