import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chartjs-plugin-colorschemes';
import { Paper, Divider, Typography } from '@material-ui/core';
import LineChart from '../../../../../atoms/Chart/LineChart';
import Pie from '../../../../../atoms/Chart/PieChart';
import ChartTabs from './ChartTabs';

export default function CanvasForChart() {
  const [tabValue, setTabValue] = React.useState(0);
  function handleTabChange(event, newValue) {
    setTabValue(newValue);
  }

  const d = [
    {
      id: '빛나나',
      twitchId: 'nana0_0',
      logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/1cf67754-44e1-462a-bf90-11384eaa0aef-profile_image-300x300.png',
      value: 12345
    },
    {
      id: '플라스틱러브',
      twitchId: 'plastick14',
      logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/02b8cbf4-8a7f-4ecc-940c-83887b9974d2-profile_image-300x300.png',
      value: 12344
    },
    {
      id: 'ㅡ유스ㅡ',
      twitchId: 'youth0430',
      logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/e1f4a07e-c12e-4fba-b843-f01aa18a22b4-profile_image-300x300.png',
      value: 12343
    },
    {
      id: '불의점령',
      twitchId: 'fireoccupation',
      logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/3c298cef-a4c4-451e-a24c-fb4ca6ed230f-profile_image-300x300.jpg',
      value: 54252
    },
    {
      id: '그믐달이',
      twitchId: 'asdf5341',
      logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/19213201-897a-4fc3-ab28-e18541949041-profile_image-300x300.png',
      value: 1234
    },
    {
      id: '리안이',
      twitchId: 'ryan124611',
      logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/4fc2f824-b0c4-456d-b9fa-d4860b36c3d7-profile_image-300x300.png',
      value: 1234
    },
    {
      id: '이숩',
      twitchId: 'lsb6390',
      logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/98bc465c-3470-48f1-aa9e-5502a9f97f04-profile_image-300x300.png',
      value: 1234
    },
    {
      id: '티에일',
      twitchId: 'sh5772',
      logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/70975d2e-0696-45f2-9393-a6d7feb76094-profile_image-300x300.png',
      value: 1234
    },
    {
      id: '워텐',
      twitchId: 'warten98',
      logo: 'https://static-cdn.jtvnw.net/user-default-pictures-uv/ce57700a-def9-11e9-842d-784f43822e80-profile_image-300x300.png',
      value: 1234
    },
    {
      id: '하리짱',
      twitchId: 'harizzang_',
      logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/cab3c841-43db-450d-963b-79a9fb623bbd-profile_image-300x300.png',
      value: 1234
    },
    {
      id: '빛나나',
      twitchId: 'nana0_0',
      logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/1cf67754-44e1-462a-bf90-11384eaa0aef-profile_image-300x300.png',
      value: 12345
    },
    {
      id: '플라스틱러브',
      twitchId: 'plastick14',
      logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/02b8cbf4-8a7f-4ecc-940c-83887b9974d2-profile_image-300x300.png',
      value: 12344
    },
    {
      id: 'ㅡ유스ㅡ',
      twitchId: 'youth0430',
      logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/e1f4a07e-c12e-4fba-b843-f01aa18a22b4-profile_image-300x300.png',
      value: 12343
    },
    {
      id: '불의점령',
      twitchId: 'fireoccupation',
      logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/3c298cef-a4c4-451e-a24c-fb4ca6ed230f-profile_image-300x300.jpg',
      value: 54252
    },
    {
      id: '그믐달이',
      twitchId: 'asdf5341',
      logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/19213201-897a-4fc3-ab28-e18541949041-profile_image-300x300.png',
      value: 12134
    },
    {
      id: '리안이',
      twitchId: 'ryan124611',
      logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/4fc2f824-b0c4-456d-b9fa-d4860b36c3d7-profile_image-300x300.png',
      value: 12134
    },
    {
      id: '이숩',
      twitchId: 'lsb6390',
      logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/98bc465c-3470-48f1-aa9e-5502a9f97f04-profile_image-300x300.png',
      value: 12134
    },
    {
      id: '티에일',
      twitchId: 'sh5772',
      logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/70975d2e-0696-45f2-9393-a6d7feb76094-profile_image-300x300.png',
      value: 13234
    },
    {
      id: '워텐',
      twitchId: 'warten98',
      logo: 'https://static-cdn.jtvnw.net/user-default-pictures-uv/ce57700a-def9-11e9-842d-784f43822e80-profile_image-300x300.png',
      value: 12334
    },
    {
      id: '하리짱',
      twitchId: 'harizzang_',
      logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/cab3c841-43db-450d-963b-79a9fb623bbd-profile_image-300x300.png',
      value: 12334
    },
    {
      id: '빛나나',
      twitchId: 'nana0_0',
      logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/1cf67754-44e1-462a-bf90-11384eaa0aef-profile_image-300x300.png',
      value: 12345
    },
    {
      id: '플라스틱러브',
      twitchId: 'plastick14',
      logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/02b8cbf4-8a7f-4ecc-940c-83887b9974d2-profile_image-300x300.png',
      value: 12344
    },
    {
      id: 'ㅡ유스ㅡ',
      twitchId: 'youth0430',
      logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/e1f4a07e-c12e-4fba-b843-f01aa18a22b4-profile_image-300x300.png',
      value: 12343
    },
    {
      id: '불의점령',
      twitchId: 'fireoccupation',
      logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/3c298cef-a4c4-451e-a24c-fb4ca6ed230f-profile_image-300x300.jpg',
      value: 54252
    },
    {
      id: '그믐달이',
      twitchId: 'asdf5341',
      logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/19213201-897a-4fc3-ab28-e18541949041-profile_image-300x300.png',
      value: 34345
    },
    {
      id: '리안이',
      twitchId: 'ryan124611',
      logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/4fc2f824-b0c4-456d-b9fa-d4860b36c3d7-profile_image-300x300.png',
      value: 13414
    },
    {
      id: '이숩',
      twitchId: 'lsb6390',
      logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/98bc465c-3470-48f1-aa9e-5502a9f97f04-profile_image-300x300.png',
      value: 343
    },
    {
      id: '티에일',
      twitchId: 'sh5772',
      logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/70975d2e-0696-45f2-9393-a6d7feb76094-profile_image-300x300.png',
      value: 5352
    },
    {
      id: '워텐',
      twitchId: 'warten98',
      logo: 'https://static-cdn.jtvnw.net/user-default-pictures-uv/ce57700a-def9-11e9-842d-784f43822e80-profile_image-300x300.png',
      value: 6363
    },
    {
      id: '하리짱',
      twitchId: 'harizzang_',
      logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/cab3c841-43db-450d-963b-79a9fb623bbd-profile_image-300x300.png',
      value: 3232
    },
  ];

  return (
    <Paper style={{ maxHeight: 600 }}>

      <div>
        <div style={{ display: 'flex', padding: '16px 16px 0px 16px' }}>
          <ChartTabs value={tabValue} handleChange={handleTabChange} />
        </div>
        <Divider />

        <div style={{ padding: 16 }}>
          {tabValue === 0 && (
            <LineChart
              labels={['12월 4일', '12월 4일', '12월 4일', '12월 4일', '12월 4일', '12월 4일', '12월 4일']}
              dataSet={[0, 0, 0, 5, 3, 0, 8]}
              height="100%"
            />
          )}

          {tabValue === 1 && (
            <Pie
              height="100%"
              labels={d.map(da => da.id)}
              data={d.map(da => da.value).sort((a, b) => b - a)}
              options={{
                plugins: {
                  colorschemes: {
                    scheme: 'tableau.Classic20'
                  }
                },
                legend: {
                  display: true,
                  position: 'right'
                }
              }}
            />
          )}

          {tabValue === 2 && (
            <Bar
              height="100%"
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'January', 'February', 'March', 'April', 'May', ],
                datasets: [
                  {
                    stack: '1',
                    label: 'Rainfall',
                    borderWidth: 2,
                    data: [65, 59, 80, 81, 56, 65, 59, 80, 81, 56, ],
                  },
                  {
                    stack: '1',
                    label: 'Rainfall2',
                    borderWidth: 2,
                    data: [12, 39, 34, 14, 56, 65, 59, 80, 81, 56, ]
                  }
                ]
              }}
              options={{
                plugins: {
                  colorschemes: {
                    scheme: 'tableau.Classic20'
                  }
                },
                tooltips: { mode: 'index', intersect: false, responsive: false },
                aspectRatio: 2
              }}
            />
          )}
        </div>

      </div>
    </Paper>
  );
}
