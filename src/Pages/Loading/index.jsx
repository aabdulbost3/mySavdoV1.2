import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function CircularLoading() {
  return (
    <Box sx={{ display: 'flex', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
      <CircularProgress />
    </Box>
  );
}