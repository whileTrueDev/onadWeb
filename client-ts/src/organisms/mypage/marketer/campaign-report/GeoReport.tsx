import React from 'react';
import shortid from 'shortid';
import {
  Grid, Typography, Button
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import BubbleChart from '@material-ui/icons/BubbleChart';
import { compose, withProps, withHandlers } from 'recompose';
import {
  withScriptjs, withGoogleMap, GoogleMap, Marker
} from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';
import dotenv from 'dotenv';
import CardTemplate from './CardTemplate';
import MaterialTable from '../../../../atoms/Table/MaterialTable';
import { GeoInterface } from '../dashboard/interfaces';
import { UseGetRequestObject } from '../../../../utils/hooks/useGetRequest';

dotenv.config();
interface MapWithMarkerClustererProps {
  onMarkerClustererClick: () => (markerClusterer: any) => void;
  markers: GeoInterface[];
}
interface MapWithMarkerClustererOutProps {
  markers: GeoInterface[];
}
// Ip To Geo Map settings
const MapWithAMarkerClusterer = compose<
  MapWithMarkerClustererProps, MapWithMarkerClustererOutProps>(
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
      onMarkerClustererClick: () => (markerClusterer: any) => {
      // 마커 클릭 이벤트 걸기
        const clickedMarkers = markerClusterer.getMarkers();
        console.log(clickedMarkers);
      },
    }),
    withScriptjs,
    withGoogleMap
  )((props: MapWithMarkerClustererProps) => (
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
        {props.markers.map((marker: GeoInterface) => (
          <Marker
            key={shortid.generate()}
            position={{ lat: marker.latitude, lng: marker.longitude }}
          />
        ))}
      </MarkerClusterer>
    </GoogleMap>
  ));

type IpToGeoData = UseGetRequestObject<GeoInterface[] | null>;
interface IpToGeoProps {
  ipToGeoData: IpToGeoData;
}

// Ip To Geo Map component
function IpToGeo(props: IpToGeoProps): JSX.Element {
  const { ipToGeoData } = props;
  const [mapOpen, setMapOpen] = React.useState<boolean>(false);

  return (
    <div>
      {ipToGeoData.loading && (
        <Skeleton height={400} />
      )}
      {!ipToGeoData.loading && ipToGeoData.data && (
        <div>
          {mapOpen ? (null) : (
            <div style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150
            }}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={(): void => { setMapOpen(true); }}
              >
                지도보기
              </Button>
            </div>
          )}

          {mapOpen ? (
            <MapWithAMarkerClusterer markers={ipToGeoData.data} />
          ) : (null)}
        </div>
      )}
    </div>
  );
}

interface GeoTableData {
  click: number;
  city: string;
}
// Ip To Get Table settgins
function groupByCity(payload: GeoInterface[] | null): Array<GeoTableData> {
  const newData: Array<GeoTableData> = [];
  const cities: Array<string> = [];
  if (payload !== null) {
    payload.map((click) => {
      if (click.city) {
        if (!cities.includes(click.city)) {
          cities.push(click.city);
          newData.push({ city: click.city, click: 1 });
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
interface IpToGeoTableProps {
  ipToGeoData: IpToGeoData;
}
function IpToGeoTable(props: IpToGeoTableProps): JSX.Element {
  const { ipToGeoData } = props;

  return (
    <div style={{ height: '410px' }}>
      {!ipToGeoData.loading && ipToGeoData.data && (
        <MaterialTable
          style={{ boxShadow: 'none' }}
          columns={[
            { title: '지역', field: 'city', },
            {
              title: '클릭',
              field: 'click',
              defaultSort: 'desc',
              render: (rowData): React.ReactNode => {
                if (rowData.city) {
                  return (<Typography>{rowData.click}</Typography>);
                }
                return null;
              }
            },
          ]}
          data={groupByCity(ipToGeoData.data)}
          options={{
            toolbar: false,
            pageSize: 5,
            pageSizeOptions: [5, 10, 15],
            maxBodyHeight: 400,
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


export default function InteractionToGeo(props: IpToGeoProps): JSX.Element {
  const { ipToGeoData, ...rest } = props;
  return (
    <div {...rest}>
      <CardTemplate title="지역별 상호작용" color="secondary" IconComponent={BubbleChart}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <IpToGeo ipToGeoData={ipToGeoData} />
          </Grid>

          <Grid item xs={12}>
            <IpToGeoTable ipToGeoData={ipToGeoData} />
          </Grid>
        </Grid>
      </CardTemplate>
    </div>
  );
}
