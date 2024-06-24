import * as React from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { Card } from '@mui/material';

const data = [
  { value: 30, label: 'Males' },
  { value: 70, label: 'Females' },
];

const size = {
  width: 350,
  height: 450,
};

export default function Genderpiechart() {
  return (
    <Card style={{ marginTop: '20px' }}>
      <h3 style={{ textAlign: 'center' }}>Gender percentage (%)</h3>
      <PieChart 
        series={[
          {
            arcLabel: (item) => `${item.label} (${item.value})`,
            arcLabelMinAngle: 45,
            data,
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fill: 'white',
            fontWeight: 'bold',
          },
        }}
        {...size}
      />
    </Card>
  );
}
