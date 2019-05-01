import React from 'react';
import {
  Grid, Paper, Typography, List, ListItem, ListItemText,
  IconButton, ListItemSecondaryAction,
} from '@material-ui/core';

export default () => (
  <Grid container>
    <Grid item xs>
      <Paper>
        <React.Fragment key={1}>
          <Typography
            variant="headline"
            style={{ textTransform: 'capitalize' }}
          >
            여기는 제목 ㄹㅇㅁㄴㄹ
          </Typography>
          <List component="ul">
            <ListItem
              key={1}
              button
            >
              <ListItemText primary="asdf" />
              <ListItemSecondaryAction>
                <IconButton />
                <IconButton />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </React.Fragment>
      </Paper>
    </Grid>
  </Grid>
);
