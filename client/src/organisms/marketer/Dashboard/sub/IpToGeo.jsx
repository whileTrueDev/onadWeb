import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import useFetchData from '../../../../utils/lib/hooks/useFetchData';

const { compose, withProps, withHandlers } = require('recompose');
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} = require('react-google-maps');
const { MarkerClusterer } = require('react-google-maps/lib/components/addons/MarkerClusterer');

const MapWithAMarkerClusterer = compose(
  withProps({
    googleMapURL: [
      'https://maps.googleapis.com/maps/api/js',
      '?key=AIzaSyAtdXsDoxu-pCerC02KWhXl0oE-PI-UDs0',
      '&v=3.exp&libraries=geometry,drawing,places'].join(''),
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '400px' }} />,
    mapElement: <div style={{ height: '100%' }} />,
  }),
  withHandlers({
    onMarkerClustererClick: () => (markerClusterer) => {
      const clickedMarkers = markerClusterer.getMarkers();
      console.log(`Current clicked markers length: ${clickedMarkers.length}`);
      console.log(clickedMarkers);
    },
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    defaultZoom={6}
    defaultCenter={{ lat: 36.2, lng: 127.959043 }}
  >
    <MarkerClusterer
      onClick={props.onMarkerClustererClick}
      averageCenter
      enableRetinaIcons
      gridSize={60}
    >
      {props.markers.map(marker => (
        <Marker
          key={shortid.generate()}
          position={{ lat: marker.latitude, lng: marker.longitude }}
        />
      ))}
    </MarkerClusterer>
  </GoogleMap>
));

export default function IpToGeo(props) {
  const { campaignId } = props;
  const data = useFetchData('/api/dashboard/marketer/geo', { campaignId });

  return (
    <div>
      {!data.loading && data.payload && (
        <MapWithAMarkerClusterer markers={data.payload} />
      )}
    </div>
  );
}

IpToGeo.propTypes = {
  campaignId: PropTypes.string.isRequired
};
