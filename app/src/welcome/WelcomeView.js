import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Jumbotron, Button } from 'reactstrap';

import {VerificationBox} from '../server/ServerView.js';

export function DefaultWelcomeConfig() {
  return {
    title: 'UiS Subsea 2018',
    subtitle: 'University of Stavanger',
    contents: {
      1: 'UiS Subsea is an innovative student organization at the University of Stavanger. As the first norwegian team we competed in the MATE ROV Competition in Alpena, MI, USA, in June 2014 and again in 2015 when the competition was hosted at the Memorial University in St. Johns, Canada.',
      2: 'October 13th 2015, the first Subsea Day was hosted at the University of Stavanger by UiS Subsea, with hopes of raising the awareness of the subsea industry among our fellow students.',
      3: 'In 2016 we are aiming to compete in two separate student competitions, the MATE Competition and the SAUC-E for autonomous underwater vehicles, as well as hosting the Subsea Day. The 15th annual MATE international competition will take place at the NASA Johnson Space Centers Neutral Buoyancy Lab June 23-25 2016. More information about the competition can be found at www.marinetech.org.',
      4: 'The team currently consists of 30 students from several engineering and business disciplines. The product development process will be the baseline for a wide range of bachelors and masters theses within engineering.',
      5: 'For more information visit www.uissubsea.no'
    }
  }
};

export const WelcomeView = (props) => {
  const data = props.data;
  return (
    <div style={{padding:'20px'}}>
     <Jumbotron style={{borderLeft: '5px solid #0d75ee'}}>
       <h1 className="display-3">{data.title}</h1>
       <p className="lead">{data.subtitle}</p>
       <hr className="my-2" />
       {
         Object.keys(data.contents).map((key) => {
           return (
             <p>{data.contents[key]}</p>
           )
         })
       }
       <hr className="my-2" />
       {
         props.serverdata.verified ?
          <div>
            <Button outline color="success" onClick={() => {props.navdata.selected='server'; props.navdata.updateState(props.navdata)}}>Server settings</Button>
          </div>
         :
          <div style={{width:'300px'}}>
            <VerificationBox data={props.serverdata}/>
          </div>
       }
     </Jumbotron>
   </div>
  )
}
