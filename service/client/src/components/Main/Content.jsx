import React from 'react';
import {
  Grid, Paper, Typography, List, ListItem, ListItemText,
} from '@material-ui/core';
import CardMedia from '@material-ui/core/CardMedia';

export default () => (
  <Grid container style={{ boxShadow: 'none', paddingTop: '56px' }}>
    <Grid item xs>
      <Paper>
        <React.Fragment key={1}>
          <Typography
            variant="headline"
            style={{ textTransform: 'capitalize' }}
          >
        여기는 제목 ㄹㅇㅁㄴㄹ
          </Typography>
          <CardMedia
            component="img"
            alt="main_top"
            image="../public/images/main_top.JPEG"
            title="main_top"
          />
          <List component="ul">
            {[1, 2, 3, 4, 5, 6].map(({ index }) => (
              <div>
                <h1>asdf</h1>
                <ListItem
                  key={index}
                  button
                >
                  <ListItemText
                    primary="primary"
                    secondary="secondary"
                  />
                </ListItem>

              </div>
            ))}
          </List>
        </React.Fragment>
      </Paper>
    </Grid>
  </Grid>
);
