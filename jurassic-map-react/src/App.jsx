import './App.css';
import MapInterface from './MapInterface';

function App() {
  return (
    <>
      <div className="App">
        <div className="main">
          <span className="header"><p>Jurassic Park - Monitoring System</p></span>
          <div className="map-table">
            <MapInterface/>
          </div>
          <div className="events-table">
            <iframe title="RecentEventsTable" scrolling="no" src="https://cloudwatch.amazonaws.com/dashboard.html?dashboard=Dino-Events&context=eyJSIjoidXMtZWFzdC0xIiwiRCI6ImN3LWRiLTM2MDI1OTcwNDE2MSIsIlUiOiJ1cy1lYXN0LTFfOHdqNkFmY0FuIiwiQyI6IjRiYjN1Y3Y3bW5ocDM3YXJoNG8zMnA3aXMzIiwiSSI6InVzLWVhc3QtMTphOGI5ZTg0Mi0yODFlLTRkOTgtYThjNi1jNWRkMzVmNWM5OGMiLCJPIjoiYXJuOmF3czppYW06OjM2MDI1OTcwNDE2MTpyb2xlL3NlcnZpY2Utcm9sZS9DV0RCU2hhcmluZy1QdWJsaWNSZWFkT25seUFjY2Vzcy01SE02SDIwUSIsIk0iOiJQdWJsaWMifQ%3D%3D"/>
          </div>
          <span className="footer"><p>jurassic-map v.67 - <a href="http://twitter.com/cloudbart">@CloudBart</a> 2022 - Adapted from art by EvoTheIrritatedNerd</p></span>
        </div>
      </div>
    </>
  );
}

export default App;