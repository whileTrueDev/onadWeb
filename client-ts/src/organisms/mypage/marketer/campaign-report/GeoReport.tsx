import React from 'react';
import shortid from 'shortid';
import {
  Grid, Typography, Button
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import BubbleChart from '@material-ui/icons/BubbleChart';
import { compose, withProps, withHandlers } from 'recompose';
import {
  withScriptjs, withGoogleMap, GoogleMap, Marker,
} from 'react-google-maps';
import MarkerClusterer, { MarkerClustererProps } from 'react-google-maps/lib/components/addons/MarkerClusterer';
import CardTemplate from './CardTemplate';
import MaterialTable from '../../../../atoms/Table/MaterialTable';
import { geoInterface } from '../dashboard/interfaces';
import { UseGetRequestObject } from '../../../../utils/hooks/useGetRequest';


// Ip To Geo Map settings
const MapWithAMarkerClusterer = compose(
  withProps({
    googleMapURL: [
      'https://maps.googleapis.com/maps/api/js',
      `?key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`,
      '&v=3',
    ].join(''),
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '400px' }} />,
    mapElement: <div style={{ height: '100%' }} />,
  }),
  withHandlers({
    onMarkerClustererClick: () => (markerClusterer: MarkerClustererProps) => {
      // 마커 클릭 이벤트 걸기
      // const clickedMarkers = markerClusterer.getMarkers();
    },
  }),
  withScriptjs,
  withGoogleMap
)((props: MarkerClustererProps) => (
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


interface propInterface {
  ipToGeoData: UseGetRequestObject<geoInterface[] | null>
  // data:

}

// Ip To Geo Map component
function IpToGeo(props: { data: UseGetRequestObject<geoInterface[] | null> }) {
  const { data } = props;
  const [mapOpen, setMapOpen] = React.useState<boolean>(false);

  return (
    <div>
      {data.loading && (
        <Skeleton height={400} />
      )}
      {!data.loading && data.data && (
        <div>
          {mapOpen ? (null) : (
            <div style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150
            }}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={() => { setMapOpen(true); }}
              >
                지도보기
              </Button>
            </div>
          )}

          {mapOpen ? (
            <MapWithAMarkerClusterer markers={data.data} />
          ) : (null)}
        </div>
      )}
    </div>
  );
}

// Ip To Get Table settgins
function groupByCity(payload: geoInterface[] | null) {
  const newData = [];
  const cities = [];
  if (payload !== null) {
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
  }
  return newData;
}

// Ip To Geo Table
function IpToGeoTable(props: { data: UseGetRequestObject<geoInterface[] | null> }) {
  const { data, ...rest } = props;

  return (
    <div style={{ height: '410px' }} {...rest}>
      {!data.loading && data.data && (
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
          data={groupByCity(data.data)}
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


export default function InteractionToGeo(props: propInterface) {
  const { ipToGeoData, ...rest } = props;
  return (
    <div {...rest}>
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
    </div>
  );
}
