/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const startTour = /* GraphQL */ `
  mutation StartTour($vehicleId: String!, $routeId: String!) {
    startTour(vehicleId: $vehicleId, routeId: $routeId) {
      executionArn
      startDate
    }
  }
`;
export const createMapMarker = /* GraphQL */ `
  mutation CreateMapMarker(
    $input: CreateMapMarkerInput!
    $condition: ModelMapMarkerConditionInput
  ) {
    createMapMarker(input: $input, condition: $condition) {
      id
      name
      color
      xcoord
      ycoord
      paddockId
      tourState
      createdAt
      updatedAt
    }
  }
`;
export const updateMapMarker = /* GraphQL */ `
  mutation UpdateMapMarker(
    $input: UpdateMapMarkerInput!
    $condition: ModelMapMarkerConditionInput
  ) {
    updateMapMarker(input: $input, condition: $condition) {
      id
      name
      color
      xcoord
      ycoord
      paddockId
      tourState
      createdAt
      updatedAt
    }
  }
`;
export const deleteMapMarker = /* GraphQL */ `
  mutation DeleteMapMarker(
    $input: DeleteMapMarkerInput!
    $condition: ModelMapMarkerConditionInput
  ) {
    deleteMapMarker(input: $input, condition: $condition) {
      id
      name
      color
      xcoord
      ycoord
      paddockId
      tourState
      createdAt
      updatedAt
    }
  }
`;
