import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Card } from '@mui/material';

export default function DemographyLineGraph() {
  return (
    <Card style={{ marginTop: '20px' }}>
      <LineChart
        xAxis={[{ data: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], scaleType: 'band' }]}
        series={[
          {
            data: [2, 3, 5.5, 8.5, 1.5, 5, 1],
            showMark: ({ index }) => index % 2 === 0,
          },
        ]}
        width={1000}
        height={500}
      />
    </Card>
  );
}