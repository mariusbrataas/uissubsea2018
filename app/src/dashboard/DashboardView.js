import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Card, CardDeck } from 'reactstrap';

import ThrustersLoad from './ThrustersLoad.js';

export function DefaultDashboardConfig() {
  return {
    title: 'Dashboard',
    subtitle: 'Not finished.'
  }
};

export const DashboardView = (props) => {
  const data = props.data;
  return (
    <div style={{padding:'20px'}}>
      <h1 className="display-3">Dashboard</h1>
      <CardDeck>
        <Card>
          <ThrustersLoad/>
        </Card>
        <Card>
          <ThrustersLoad/>
        </Card>
      </CardDeck>
   </div>
  )
}
