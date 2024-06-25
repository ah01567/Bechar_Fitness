import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Card } from '@mui/material';
import { getDatabase, ref, onValue } from 'firebase/database';

export default function MembershipTypesBarChart() {
  const [membershipCounts, setMembershipCounts] = React.useState({
    'Bodybuilding': 0,
    'Cardio': 0,
    'BodyB & Cardio': 0,
    'BodyB with coach': 0,
    'BodyB&Cardio-coach': 0,
    'Women': 0
  });

  const membershipMapping = {
    'Bodybuilding': 'Bodybuilding',
    'Cardio': 'Cardio',
    'Bodybuilding & Cardio': 'BodyB & Cardio',
    'Bodybuilding with coaching': 'BodyB with coach',
    'Bodybuilding & Cardio with coaching': 'BodyB&Cardio-coach',
    'Women': 'Women'
  };

  React.useEffect(() => {
    const database = getDatabase();
    const usersRef = ref(database, 'Users');

    onValue(usersRef, (snapshot) => {
      const users = snapshot.val();

      // Initialize a new counts object
      let counts = {
        'Bodybuilding': 0,
        'Cardio': 0,
        'BodyB & Cardio': 0,
        'BodyB with coach': 0,
        'BodyB&Cardio-coach': 0,
        'Women': 0
      };

      // Count occurrences of each membership type using the mapping
      if (users) {
        Object.values(users).forEach((user) => {
          if (user.membershipType) {
            const chartLabel = membershipMapping[user.membershipType];
            if (chartLabel) {
              counts[chartLabel]++;
            }
          }
        });
      }

      // Update state with the counts
      setMembershipCounts(counts);
    });

    return () => {
      // Clean up any event listeners or subscriptions if needed
    };
  }, []);

  const membershipTypes = ['Bodybuilding', 'Cardio', 'BodyB & Cardio', 'BodyB with coach', 'BodyB&Cardio-coach', 'Women'];
  const data = membershipTypes.map(type => membershipCounts[type] || 0);

  return (
    <Card style={{ marginTop: '20px', width: '70%'}}>
      <BarChart
        xAxis={[{ scaleType: 'band', data: membershipTypes }]}
        series={[{ data: data, color: 'SteelBlue'  }]}
        width={900}
        height={500}
      />
    </Card>
  );
}