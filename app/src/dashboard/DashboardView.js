import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {
  Card,
  CardDeck
} from 'reactstrap';

import ThrustersLoad from './ThrustersLoad.js';

export function DefaultDashboardConfig(sendThrusts) {
  return {
    title: 'Dashboard',
    subtitle: 'Not finished.',
    loads: {
      flv: 0.0,
      frv: 0.0,
      alv: 0.0,
      arv: 0.0,
      flh: 0.0,
      frh: 0.0,
      alh: 0.0,
      arh: 0.0
    },
    sendThrusts: sendThrusts
  }
};

export const DashboardView = (props) => {
  const data = props.data;
  const loads = props.data.loads;
  return (
    <div style={{padding:'20px'}}>
      <h1 className="display-3">Dashboard</h1>
      <CardDeck>
        <Card>
          <ThrustersLoad
            sendThrusts={data.sendThrusts}
            flv={loads.flv}
            frv={loads.frv}
            alv={loads.alv}
            arv={loads.arv}
            flh={loads.flh}
            frh={loads.frh}
            alh={loads.alh}
            arh={loads.arh}
          />
        </Card>
        <Card>
        </Card>
        <Card>
        </Card>
      </CardDeck>
    </div>
  )
}
