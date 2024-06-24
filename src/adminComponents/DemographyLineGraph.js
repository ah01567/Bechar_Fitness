import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Card } from '@mui/material';

export default function DemographyLineGraph() {
  return (
    <Card style={{ marginTop: '20px'}}>
      <LineChart
        xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }]}
        series={[
          {
            data: [2, 3, 5.5, 8.5, 1.5, 5, 1, 4, 3, 8],
            showMark: ({ index }) => index % 2 === 0,
          },
        ]}
        width={1000}
        height={500}
      />
    </Card>
  );
}
