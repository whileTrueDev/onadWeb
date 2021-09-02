import { Button, makeStyles, Typography } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { GoogleMap, Marker, withGoogleMap, withScriptjs } from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';
import { compose, withHandlers, withProps } from 'recompose';
import CustomDataGrid from '../../../../../../../atoms/table/customDataGrid';
import {
  CampaignGeoData,
  useMarketerCampaignGeoData,
} from '../../../../../../../utils/hooks/query/useMarketerCampaignGeoData';

interface MapWithMarkerClustererProps {
  onMarkerClustererClick: () => (markerClusterer: any) => void;
  markers: CampaignGeoData[];
}
interface MapWithMarkerClustererOutProps {
  markers: CampaignGeoData[];
}
// Ip To Geo Map settings
const MapWithAMarkerClusterer = compose<
  MapWithMarkerClustererProps,
  MapWithMarkerClustererOutProps
>(
  withProps({
    googleMapURL: [
      'https://maps.googleapis.com/maps/api/js',
      `?key=${process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAP_API_KEY}`,
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
      {props.markers.map((marker: CampaignGeoData) => (
        <Marker key={nanoid()} position={{ lat: marker.latitude, lng: marker.longitude }} />
      ))}
    </MarkerClusterer>
  </GoogleMap>
));

interface IpToGeoProps {
  campaignId: string;
  [key: string]: any;
}

// Ip To Geo Map component
function IpToGeo(props: IpToGeoProps): JSX.Element {
  const { campaignId } = props;
  const ipToGeoData = useMarketerCampaignGeoData(campaignId);
  const [mapOpen, setMapOpen] = useState<boolean>(false);

  return (
    <div>
      {ipToGeoData.isLoading && <Skeleton height={400} />}
      {!ipToGeoData.isLoading && ipToGeoData.data && (
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
function groupByCity(payload: CampaignGeoData[] | null): Array<GeoTableData> {
  const newData: Array<GeoTableData> = [];
  const cities: Array<string> = [];
  if (payload !== null) {
    payload.map(click => {
      if (click.city) {
        if (!cities.includes(click.city)) {
          cities.push(click.city);
          newData.push({ id: nanoid(), city: click.city, click: 1 });
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
  campaignId: string;
}
function IpToGeoTable(props: IpToGeoTableProps): JSX.Element {
  const { campaignId } = props;
  const ipToGeoData = useMarketerCampaignGeoData(campaignId);

  const classes = useStyles();

  return (
    <div style={{ height: '250px' }}>
      {!ipToGeoData.isLoading && ipToGeoData.data && (
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
  const { campaignId, ...rest } = props;
  const ipToGeoData = useMarketerCampaignGeoData(campaignId);
  return (
    <div {...rest}>
      <IpToGeo campaignId={campaignId} />
      <IpToGeoTable campaignId={campaignId} />
      {!ipToGeoData.isLoading && (
        <div style={{ padding: 8 }}>
          <Typography variant="caption">
            * 정확한 위치가 확인되는 경우만 목록에 표시됩니다.
          </Typography>
        </div>
      )}
    </div>
  );
}
