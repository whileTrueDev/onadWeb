import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import Skeleton from '@material-ui/lab/Skeleton';

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
      '&v=3',
      `?key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`
    ].join(''),
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '400px' }} />,
    mapElement: <div style={{ height: '100%' }} />,
  }),
  withHandlers({
    onMarkerClustererClick: () => (markerClusterer) => {
      const clickedMarkers = markerClusterer.getMarkers();
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
  const { data } = props;

  return (
    <div>
      {data.loading && (
        <Skeleton height={400} />
      )}
      {!data.loading && data.payload && (
        <MapWithAMarkerClusterer markers={data.payload} />
      )}
    </div>
  );
}

IpToGeo.propTypes = {
  data: PropTypes.object
};
