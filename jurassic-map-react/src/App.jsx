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
  //Initial call to fetch map markers from DynamoDB table
  fetchMapMarkers()
  //Marker-drawing function
  function drawMarker(ctx, markerId, frameCount) {
    //Try to find current map marker in fetched mapMarkers array
    try {
      let currentMarker = markerArray.find(item => item.id === markerId)
      //Reset visibility, check for visbility of current marker
      var visible = true
      if (currentMarker.tourState === "idle") { visible = false; return }
      //Begin drawing context setup
      ctx.lineWidth = 2
      ctx.beginPath()
      //If frameCount is defined, marker should be animated
      if (typeof frameCount != "undefined" && visible) {
        ctx.arc(currentMarker.xcoord, currentMarker.ycoord, 5 * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI, false)
      }
      //If frameCount is undefined, then marker should not be animated
      else if (visible) {
        ctx.arc(currentMarker.xcoord, currentMarker.ycoord, 5, 0, 2 * Math.PI, false)
      }
      ctx.fillStyle = currentMarker.color
      ctx.fill()
    }
    catch (err) { console.log(markerId + 'not found') }
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
          <span className="header"><p>Jurassic Park - Monitoring System</p></span>
          <div className="map-table">
            <div className="mapTableSidePanel">
              <img className="mapTableSidePanelImg" src="mapGuideTop_715x345.png" alt="MapLocationsIndex"/>
              <img className="mapTableSidePanelImg" src="mapGuideMiddle_715x1395.png" alt="DinosaurIndex"/>
              <img className="mapTableSidePanelImg" src="mapGuideBottom_715x250.png" alt="MapIndex"/>
              <span><p>Built with AWS Serverless</p></span>
              <div className="awsIconsPanel">
                <a title="AWS AppSync" href="https://aws.amazon.com/appsync/">
                  <img src="awsicons/Arch_AWS-AppSync_16.png" alt="AppSync icon"/></a>
                <a title="AWS Lambda"href="https://aws.amazon.com/lambda/">
                  <img src="awsicons/Arch_AWS-Lambda_16.png" alt="Lambda icon"/></a>
                <a title="AWS Step Functions" href="https://aws.amazon.com/step-functions/">
                  <img src="awsicons/Arch_AWS-Step-Functions_16.png" alt="StepFunctions icon"/></a>
                <a title="Amazon DynamoDB" href="https://aws.amazon.com/dynamodb/">
                  <img src="awsicons/Arch_Amazon-DynamoDB_16.png" alt="DynamoDB icon"/></a>
                <a title="AWS Serverless Application Model" href="https://aws.amazon.com/serverless/sam/">
                  <img src="awsicons/Arch_AWS-CloudFormation_16.png" alt="CloudFormation icon"/></a>
              </div>
            </div>
            <div className="mapTableMap">
              <div className="tourVehicleInterface">
                <div><img title="Vehicle 1" src="jurassicmap tour vehicle 25x59.png" alt="JurassicMap tour vehicle 1" onclick="startTour(vehicle01)"/><p>01</p></div>
                <div><img title="Vehicle 2" src="jurassicmap tour vehicle 25x59.png" alt="JurassicMap tour vehicle 2" onclick="startTour(vehicle02)"/><p>02</p></div>
                <div><img title="Vehicle 3" src="jurassicmap tour vehicle 25x59.png" alt="JurassicMap tour vehicle 3" onclick="startTour(vehicle03)"/><p>03</p></div>
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
          </div>
          <div className="events-table">
            <iframe title="RecentEventsTable" scrolling="no" src="https://cloudwatch.amazonaws.com/dashboard.html?dashboard=Dino-Events&context=eyJSIjoidXMtZWFzdC0xIiwiRCI6ImN3LWRiLTM2MDI1OTcwNDE2MSIsIlUiOiJ1cy1lYXN0LTFfOHdqNkFmY0FuIiwiQyI6IjRiYjN1Y3Y3bW5ocDM3YXJoNG8zMnA3aXMzIiwiSSI6InVzLWVhc3QtMTphOGI5ZTg0Mi0yODFlLTRkOTgtYThjNi1jNWRkMzVmNWM5OGMiLCJPIjoiYXJuOmF3czppYW06OjM2MDI1OTcwNDE2MTpyb2xlL3NlcnZpY2Utcm9sZS9DV0RCU2hhcmluZy1QdWJsaWNSZWFkT25seUFjY2Vzcy01SE02SDIwUSIsIk0iOiJQdWJsaWMifQ%3D%3D"/>
          </div>
          <span className="footer"><p>jurassic-map v.63 - <a href="http://twitter.com/cloudbart">@CloudBart</a> 2022 - Adapted from art by EvoTheIrritatedNerd</p></span>
        </div>
      </div>
    </>
  );
}

export default App;