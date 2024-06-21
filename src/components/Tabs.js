import React from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import AllMemberships from '../adminComponents/AllMemberships'; 
import PendingMemberships from '../adminComponents/PendingMemberships'; 

export default function ScrollableTabsButtonAuto() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', marginTop: '20px', width: '90%' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        <Tab label="Overall" />
        <Tab label="All memberships" />
        <Tab label="Pending memberships " />
      </Tabs>
      
      <Box sx={{ marginTop: '20px'}}>
        {value === 0 && <Typography>
          Overall
        </Typography>}

        {value === 1 && <Typography>
          <AllMemberships />
        </Typography>}
        
        {value === 2 && <Typography>
          <PendingMemberships />
        </Typography>}
        
      </Box>
    </Box>
  );
}
