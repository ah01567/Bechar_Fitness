import { React, useState, useEffect } from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { Card } from '@mui/material';
import { getDatabase, ref, onValue } from 'firebase/database';

export default function Genderpiechart() {
  const [malePercentage, setMalePercentage] = useState(0);
  const [femalePercentage, setFemalePercentage] = useState(0);

  useEffect(() => {
      const db = getDatabase();
      const usersRef = ref(db, 'Users');

      // Fetch total males and females to calculate percentages
      onValue(usersRef, (snapshot) => {
          if (snapshot.exists()) {
              const usersData = snapshot.val();
              let totalMales = 0;
              let totalFemales = 0;
              const totalUsers = Object.keys(usersData).length;

              // Count males and females
              Object.values(usersData).forEach((user) => {
                  if (user.gender === 'Male') {
                      totalMales++;
                  } else if (user.gender === 'Female') {
                      totalFemales++;
                  }
              });

              // Calculate percentages
              const malePercent = (totalMales / totalUsers) * 100;
              const femalePercent = (totalFemales / totalUsers) * 100;

              setMalePercentage(malePercent.toFixed(2));
              setFemalePercentage(femalePercent.toFixed(2));
          } else {
              setMalePercentage(0);
              setFemalePercentage(0);
          }
      }, {
          onlyOnce: true // Fetch data only once
      });
  }, []);

  const data = [
      { value: malePercentage, label: 'Males', color: 'green' },
      { value: femalePercentage, label: 'Females', color: 'red' },
  ];

  const size = {
      width: 350,
      height: 450,
  };

  return (
      <Card style={{ marginTop: '20px' }}>
          <h3 style={{ textAlign: 'center' }}>Gender percentage (%)</h3>
          <PieChart
              series={[
                  {
                      arcLabel: (item) => `${item.label} (${item.value}%)`,
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