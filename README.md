# jurassic-map
Park systems map from Jurassic Park


# /jurassic-map-markers
Contains the AWS SAM project for creating the MapMarker control componenets which include
- State Machine for orchestrationg marker updates
- Lambda for performing individual marker randomization and update
- CloudWatch Event for invoke State Machine every minute
- Lambda layer containing @Turf geospatial libraries for testing markers within paddocks


# /jurassic-map-react
Contains the AWS Amplify front-end and back-end for jurassicmap.com
- Written in React
- Uses Amplify for backend management (AppSync GraphQL API and DynamoDB)
- Uses Amplify-generated AppSync queries
