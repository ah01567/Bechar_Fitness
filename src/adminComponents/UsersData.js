import React from 'react';
import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';

export default function BasicCard() {
  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Card style={{ width: '30%'}}>
        <CardContent>
          <Typography sx={{ fontSize: 22 }} color="text.secondary" gutterBottom>
            Total memberships
          </Typography>

          <Typography sx={{ fontSize: 32 }} variant="body2">
          67
          </Typography>
        </CardContent>
      </Card>

      <Card style={{width: '30%'}}>
        <CardContent>
          <Typography sx={{ fontSize: 22 }} color="text.secondary" gutterBottom>
            Total males
          </Typography>
          <Typography sx={{ fontSize: 32 }} variant="body2">
          42
          </Typography>
        </CardContent>
      </Card>

      <Card style={{ width: '30%'}}>
        <CardContent>
          <Typography sx={{ fontSize: 22 }} color="text.secondary" gutterBottom>
            Total females
          </Typography>
          <Typography sx={{ fontSize: 32 }} variant="body2" color="black">
            25
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
