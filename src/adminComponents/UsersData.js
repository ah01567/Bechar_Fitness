import { React, useState, useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { getDatabase, ref, onValue } from 'firebase/database';

export default function BasicCard() {
  const [totalMemberships, setTotalMemberships] = useState(0);
    const [totalMales, setTotalMales] = useState(0);
    const [totalFemales, setTotalFemales] = useState(0);

    useEffect(() => {
        const db = getDatabase();
        const usersRef = ref(db, 'Users');

        // Fetch total memberships
        onValue(usersRef, (snapshot) => {
            if (snapshot.exists()) {
                const usersData = snapshot.val();
                const totalUsers = Object.keys(usersData).length;
                setTotalMemberships(totalUsers);

                // Calculate total males and females
                let malesCount = 0;
                let femalesCount = 0;

                Object.values(usersData).forEach((user) => {
                    if (user.gender === 'Male') {
                        malesCount++;
                    } else if (user.gender === 'Female') {
                        femalesCount++;
                    }
                });

                setTotalMales(malesCount);
                setTotalFemales(femalesCount);
            } else {
                setTotalMemberships(0);
                setTotalMales(0);
                setTotalFemales(0);
            }
        }, {
            onlyOnce: true // Fetch data only once
        });
    }, []);

    return (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Card style={{ width: '30%' }}>
                <CardContent>
                    <Typography sx={{ fontSize: 22 }} color="text.secondary" gutterBottom>
                        Total memberships
                    </Typography>
                    <Typography sx={{ fontSize: 32 }} variant="body2">
                        {totalMemberships}
                    </Typography>
                </CardContent>
            </Card>

            <Card style={{ width: '30%' }}>
                <CardContent>
                    <Typography sx={{ fontSize: 22 }} color="text.secondary" gutterBottom>
                        Total males
                    </Typography>
                    <Typography sx={{ fontSize: 32 }} variant="body2">
                        {totalMales}
                    </Typography>
                </CardContent>
            </Card>

            <Card style={{ width: '30%' }}>
                <CardContent>
                    <Typography sx={{ fontSize: 22 }} color="text.secondary" gutterBottom>
                        Total females
                    </Typography>
                    <Typography sx={{ fontSize: 32 }} variant="body2">
                        {totalFemales}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
}