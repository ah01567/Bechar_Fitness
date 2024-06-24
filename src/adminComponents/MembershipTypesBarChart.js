import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Card } from '@mui/material';


export default function MembershipTypesBarChart() {
  return (
    <Card style={{ marginTop: '20px', width: '70%'}}>
      <BarChart
        xAxis={[{ scaleType: 'band', data: ['Bodybuilding', 'Cardio', 'BodyB & Cardio', 'BodyB with coach', 'BodyB&Cardio-coach', 'Women'] }]}
        series={[{ data: [5, 2, 6, 7, 8, 1] }]}
        width={900}
        height={500}
      />
    </Card>
  );
}
