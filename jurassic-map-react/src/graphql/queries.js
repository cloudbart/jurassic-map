/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getMapMarker = /* GraphQL */ `
  query GetMapMarker($id: ID!) {
    getMapMarker(id: $id) {
      id
      name
      color
      xcoord
      ycoord
      paddockId
      tourState
    }
  }
`;
export const listMapMarkers = /* GraphQL */ `
  query ListMapMarkers(
    $filter: ModelMapMarkerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMapMarkers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        color
        xcoord
        ycoord
        paddockId
        tourState
      }
      nextToken
    }
  }
`;
