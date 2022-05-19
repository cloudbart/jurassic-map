import './App.css';
import MapInterface from './MapInterface';

function App() {
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
            <MapInterface/>
          </div>
          <div className="events-table">
            <iframe title="RecentEventsTable" scrolling="no" src="https://cloudwatch.amazonaws.com/dashboard.html?dashboard=Dino-Events&context=eyJSIjoidXMtZWFzdC0xIiwiRCI6ImN3LWRiLTM2MDI1OTcwNDE2MSIsIlUiOiJ1cy1lYXN0LTFfOHdqNkFmY0FuIiwiQyI6IjRiYjN1Y3Y3bW5ocDM3YXJoNG8zMnA3aXMzIiwiSSI6InVzLWVhc3QtMTphOGI5ZTg0Mi0yODFlLTRkOTgtYThjNi1jNWRkMzVmNWM5OGMiLCJPIjoiYXJuOmF3czppYW06OjM2MDI1OTcwNDE2MTpyb2xlL3NlcnZpY2Utcm9sZS9DV0RCU2hhcmluZy1QdWJsaWNSZWFkT25seUFjY2Vzcy01SE02SDIwUSIsIk0iOiJQdWJsaWMifQ%3D%3D"/>
          </div>
          <span className="footer"><p>jurassic-map v.65 - <a href="http://twitter.com/cloudbart">@CloudBart</a> 2022 - Adapted from art by EvoTheIrritatedNerd</p></span>
        </div>
      </div>
    </>
  );
}

export default App;