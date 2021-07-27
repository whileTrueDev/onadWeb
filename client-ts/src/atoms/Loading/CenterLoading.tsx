import { Box, CircularProgress } from '@material-ui/core';

interface CenterLoadingProps {
  height?: number;
}
export default function CenterLoading({ height = 200 }: CenterLoadingProps): JSX.Element {
  return (
    <Box justifyContent="center" display="flex" alignItems="center" minHeight={height}>
      <CircularProgress />
    </Box>
  );
}
