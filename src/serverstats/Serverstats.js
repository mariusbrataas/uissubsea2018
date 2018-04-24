import React, { Component } from 'react';

// Sett onclick funksjoner her!

const Serverstats = (props) => {
  const data = props.data;
  const mets = props.mets;
  return (
    <div className='serverstats'>
      <h2>Server status</h2>
      <p>Clients: {data.nclients}</p>
      <p>Last heartbeat: {data.lastHeartbeat}</p>
      <button onClick={data.actHeartbeat ? mets.heartStop : mets.heartStart}>{data.actHeartbeat ? 'Stop heartbeat' : 'Start heartbeat'}</button>
    </div>
  )
}

export default Serverstats
