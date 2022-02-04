// Import AWS SDK
const AWS = require('aws-sdk');
// Create DynamoDB client
const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
// Import Turf GeoSpatial libraries
const turf = require('@turf/turf');
// Import Turf helpers libraries for point and polygon
const helpers = require('@turf/helpers');
// Create Turf helpers function
turf.helpers = helpers;

var newItem;
var paddock;

// Function for looking up and setting the current mapMarker's paddock coordinates
function paddockLookup(input) {
    console.log("Current Paddock: ", input);
    switch (input) {
        case 'herbLoc01':
            paddock = helpers.polygon([
                [
                    [303, 300],
                    [336, 287],
                    [338, 225],
                    [390, 200],
                    [374, 151],
                    [288, 211],
                    [266, 241],
                    [266, 262],
                    [303, 300]
                ]
            ]);
            break;
        case 'baryonyxLoc01':
            paddock = helpers.polygon([
                [
                    [492,370],
                    [508,345],
                    [553,304],
                    [553,297],
                    [546,279],
                    [551,259],
                    [497,253],
                    [450,344],
                    [453,357],
                    [492,370]
                ]
            ]);
            break;
        case 'trikeLoc01':
            paddock = helpers.polygon([
                [
                    [390, 199],
                    [404, 197],
                    [415, 175],
                    [429, 166],
                    [474, 174],
                    [473, 154],
                    [427, 115],
                    [404, 134],
                    [375, 151],
                    [390, 199]
                ]
            ]);
            break;
        case 'diloLoc01':
            paddock = helpers.polygon([
                [
                    [275, 311],
                    [292, 303],
                    [266, 274],
                    [264, 262],
                    [252, 252],
                    [246, 251],
                    [258, 282],
                    [275, 311]
                ]
            ]);
            break;
        case 'trexLoc01':
            paddock = helpers.polygon([
                [
                    [437, 286],
                    [458, 249],
                    [552, 260],
                    [554, 254],
                    [550, 249],
                    [512, 233],
                    [494, 216],
                    [492, 206],
                    [496, 179],
                    [474, 174],
                    [475, 207],
                    [417, 193],
                    [422, 177],
                    [423, 166],
                    [416, 171],
                    [405, 193],
                    [390, 197],
                    [354, 233],
                    [358, 265],
                    [437, 286]
                ]
            ]);
            break;
    }
}

// Function for randomly incrementing the input number, returns result as a string
function random(input) {
    // use this to further randomize dinosaur marker movement extent
    let offSet = Math.ceil(Math.random() * 10);
    let x = input;
    let y = (Math.ceil(Math.random() * 10) - offSet);
    let result = x + y;
    return result.toString();
}

// Function for random marker movement, must remain with padock, input is the current mapMarker item
function randomWithin(input) {
    paddockLookup(input.paddockId.S);
    // Reset boolean and attempts for looping random marker movement within the padock
    let within = false;
    let attempts = 0;
    while (!within) {
        // Set/reset tempItem to input mapMarker item
        let tempItem = input;
        // Perform random coordinate attempt
        tempItem.xcoord.N = random(parseInt(input.xcoord.N));
        tempItem.ycoord.N = random(parseInt(input.ycoord.N));
        let tempCoords = helpers.point([
            parseInt(tempItem.xcoord.N),
            parseInt(tempItem.ycoord.N)
        ]);
        // Test for temporary coordinates attempt valid (within boundaries)
        if (turf.booleanPointInPolygon(tempCoords, paddock)) {
            console.log("Updating marker:", tempItem.name.S);
            console.log("New coords:", tempItem.xcoord.N, ",", tempItem.ycoord.N);
            newItem = tempItem;
            return true;
        }
        else {
            // Check for too many attempts
            if (attempts == 10) {
                console.log("MARKER OUT OF BOUNDS");
                return;
            }
            // Continue mapMarker update attempts
            else {
                console.log("NOT WITHIN, RETRYING");
                attempts++;
            }
        }
    }
}

//Function handler code
exports.mapMarkerHandler = (event, context, callback) => {
    // Log the received input data event
    console.log('InputRecieved: ', JSON.stringify(event));
    // Populate DynamoDB client parameters
    let params = {
        TableName: event.table,
        Key: { 'id': { S: event.id } }
    };
    // Call DynamoDB to read the mapMarker item current coordinates from the table
    dynamodb.getItem(params, function(err, data) {
        // Check for getItem errors
        if (err) {
            console.log(err, err.stack);
            callback(null, {
                statusCode: '500',
                body: err
            });
        }
        // Successfull getItem, proceed to random increment update and paddock validation
        else {
            // Call mapMarker randomWithin function
            randomWithin(data.Item);
            // Write newItem back to DDB
            dynamodb.putItem({
                TableName: event.table,
                Item: newItem
            }, function(err, data) {
                if (err) {
                    console.log(err, err.stack);
                    callback(null, {
                        statusCode: '500',
                        body: err
                    });
                }
                else {
                    callback(null, {
                        statusCode: '200',
                        body: 'SUCCESS'
                    });
                }
            });
        }
    });
};
