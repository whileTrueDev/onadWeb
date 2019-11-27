import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import MaterialTable from '../../../../atoms/Table/MaterialTable';

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

export default function IpToGeoTable(props) {
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

IpToGeoTable.propTypes = {
  data: PropTypes.object
};
