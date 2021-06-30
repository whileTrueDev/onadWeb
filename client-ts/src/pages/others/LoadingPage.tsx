import { Box, CircularProgress } from '@material-ui/core';
import React from 'react';

export default function LoadingPage(): React.ReactElement {
  return (
    <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
      <CircularProgress />
    </Box>
  );
}
