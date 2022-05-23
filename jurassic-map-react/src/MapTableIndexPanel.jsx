import React from 'react';

const MapTableIndexPanel = () => {
  
  return (
    <div className="indexPanel">
        <img className="indexPanelImg" src="mapGuideBottom_715x250.png" alt="MapIndex"/>
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
  );
};

export default MapTableIndexPanel;