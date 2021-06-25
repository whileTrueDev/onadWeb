import React from 'react';
import shortid from 'shortid';
import { Typography, Button, makeStyles } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { compose, withProps, withHandlers } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';
import dotenv from 'dotenv';
import { GeoInterface } from '../../../../dashboard/interfaces';
import { UseGetRequestObject } from '../../../../../../../utils/hooks/useGetRequest';
import CustomDataGrid from '../../../../../../../atoms/Table/CustomDataGrid';

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
  MapWithMarkerClustererProps,
  MapWithMarkerClustererOutProps
>(
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
  withGoogleMap,
)((props: MapWithMarkerClustererProps) => (
  <GoogleMap defaultZoom={6} defaultCenter={{ lat: 36.2, lng: 127.959043 }}>
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

type IpToGeoData = UseGetRequestObject<GeoInterface[]>;
interface IpToGeoProps {
  ipToGeoData: IpToGeoData;
  [key: string]: any;
}

// Ip To Geo Map component
function IpToGeo(props: IpToGeoProps): JSX.Element {
  const { ipToGeoData } = props;
  const [mapOpen, setMapOpen] = React.useState<boolean>(false);

  return (
    <div>
      {ipToGeoData.loading && <Skeleton height={400} />}
      {!ipToGeoData.loading && ipToGeoData.data && (
        <div>
          {mapOpen ? null : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 150,
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={(): void => {
                  setMapOpen(true);
                }}
              >
                지도보기
              </Button>
            </div>
          )}

          {mapOpen ? <MapWithAMarkerClusterer markers={ipToGeoData.data} /> : null}
        </div>
      )}
    </div>
  );
}

interface GeoTableData {
  id: string;
  click: number;
  city: string;
}
// Ip To Get Table settgins
function groupByCity(payload: GeoInterface[] | null): Array<GeoTableData> {
  const newData: Array<GeoTableData> = [];
  const cities: Array<string> = [];
  if (payload !== null) {
    payload.map(click => {
      if (click.city) {
        if (!cities.includes(click.city)) {
          cities.push(click.city);
          newData.push({ id: shortid.generate(), city: click.city, click: 1 });
        } else {
          newData.map((d, idx) => {
            if (d.city === click.city) {
              newData[idx] = {
                ...newData[idx],
                click: newData[idx].click + 1,
              };
            }
            return d;
          });
        }
      }
      return click;
    });
  }
  return newData.sort((x, y) => y.click - x.click);
}

const useStyles = makeStyles(() => ({
  datagrid: {
    borderLeft: 'none',
    borderRight: 'none',
  },
}));
// Ip To Geo Table
interface IpToGeoTableProps {
  ipToGeoData: IpToGeoData;
}
function IpToGeoTable(props: IpToGeoTableProps): JSX.Element {
  const { ipToGeoData } = props;
  const classes = useStyles();

  return (
    <div style={{ height: '250px' }}>
      {!ipToGeoData.loading && ipToGeoData.data && (
        <CustomDataGrid
          disableSelectionOnClick
          className={classes.datagrid}
          rows={groupByCity(ipToGeoData.data)}
          density="compact"
          columns={[
            {
              headerName: '지역',
              field: 'city',
              align: 'center',
              headerAlign: 'center',
              flex: 1,
            },
            {
              headerName: '클릭',
              field: 'click',
              align: 'center',
              headerAlign: 'center',
              flex: 1,
            },
          ]}
        />
      )}
    </div>
  );
}

export default function GeoReport(props: IpToGeoProps): JSX.Element {
  const { ipToGeoData, ...rest } = props;
  return (
    <div {...rest}>
      <IpToGeo ipToGeoData={ipToGeoData} />
      <IpToGeoTable ipToGeoData={ipToGeoData} />
      <div style={{ padding: 8 }}>
        <Typography variant="caption">
          * 정확한 위치가 확인되는 경우만 목록에 표시됩니다.
        </Typography>
      </div>
    </div>
  );
}
