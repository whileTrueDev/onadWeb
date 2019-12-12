import React from 'react';
import shortid from 'shortid';
import { Grid, Typography } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import BubbleChart from '@material-ui/icons/BubbleChart';
import { compose, withProps, withHandlers } from 'recompose';
import {
  withScriptjs, withGoogleMap, GoogleMap, Marker,
} from 'react-google-maps';
import { MarkerClusterer } from 'react-google-maps/lib/components/addons/MarkerClusterer';
import CardTemplate from '../common/CardTemplate';
import MaterialTable from '../../../../../../atoms/Table/MaterialTable';

// Ip To Geo Map settings
const MapWithAMarkerClusterer = compose(
  withProps({
    googleMapURL: [
      'https://maps.googleapis.com/maps/api/js',
      `?key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`,
      '&v=3.exp&libraries=geometry,drawing,places'].join(''),
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '400px' }} />,
    mapElement: <div style={{ height: '100%' }} />,
  }),
  withHandlers({
    onMarkerClustererClick: () => (markerClusterer) => {
      const clickedMarkers = markerClusterer.getMarkers();
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

// Ip To Geo Map component
function IpToGeo(props) {
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

// Ip To Get Table settgins
function groupByCity(payload) {
  const newData = [];
  const cities = [];
  payload.map((click) => {
    if (click.city) {
      if (!cities.includes(click.city)) {
        cities.push(click.city);
        newData.push({
          city: click.city,
          click: 1
        });
      } else {
        newData.map((d, idx) => {
          if (d.city === click.city) {
            newData[idx] = {
              ...newData[idx],
              click: newData[idx].click + 1
            };
          }
          return d;
        });
      }
    }
    return click;
  });
  return newData;
}

// Ip To Geo Table
function IpToGeoTable(props) {
  const { data } = props;

  return (
    <div style={{ height: '400px' }}>
      {!data.loading && data.payload && (
        <MaterialTable
          style={{ boxShadow: 'none' }}
          columns={[
            { title: '지역', field: 'city', },
            {
              title: '클릭',
              field: 'click',
              defaultSort: 'desc',
              render: (rowData) => {
                if (rowData.city) {
                  return (<Typography>{rowData.click}</Typography>);
                }
                return null;
              }
            },
          ]}
          data={groupByCity(data.payload)}
          options={{
            toolbar: false,
            add: false,
            pageSize: 5,
            pageSizeOptions: [5, 10, 15],
            maxBodyHeight: 400,
            rowStyle: {
              '&:hover': {
                backgroundColor: '#rgb(211, 211, 211)',
              },
            },
            searchFieldAlignment: 'right'
          }}
        />
      )}
      <div style={{ padding: 8 }}>
        <Typography variant="caption">* 정확한 위치가 확인되는 경우에만 해당 테이블에 표시됩니다.</Typography>
      </div>
    </div>
  );
}

export default function InteractionToGeo(props) {
  const { ipToGeoData } = props;
  return (
    <CardTemplate title="지역별 상호작용" color="secondary" IconComponent={BubbleChart}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <IpToGeo data={ipToGeoData} />
        </Grid>

        <Grid item xs={12}>
          <IpToGeoTable data={ipToGeoData} />
        </Grid>
      </Grid>
    </CardTemplate>
  );
}
