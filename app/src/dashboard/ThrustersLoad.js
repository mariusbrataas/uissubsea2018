import React from 'react';
import '../App.css';

import CircularProgressbar from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function f(percentage, n, k) {
  return k + Math.pow(Math.abs(percentage), 1/n) * (1-k)
}

function calcColors(percentage) {
  const r = Math.round(f(percentage * (percentage >= 0), 4, 0.2) * 255);
  const g = Math.round(f(1-Math.abs(percentage), 4, 0.2) * 100);
  const b = 255 - r;
  return `rgba(${r},${g},${b},1)`
}

const CircleLoad = (props) => {
  const loadColor = calcColors(props.percentage);
  return(
    <CircularProgressbar
      percentage={Math.abs(props.percentage)}
      textForPercentage={(percentage) => {return `${Math.round(props.percentage*100)}%`}}
      styles={{
        path: {stroke: loadColor},
        text: {fill: loadColor}
      }}
    />
  )
}

export const ThrustersLoad = (props) => {
  return (
    <div>
      <div style={{width:'100%', overflow:'hidden'}}>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}><CircleLoad load={props.flh}/></div></div>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}></div></div>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}></div></div>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}><CircleLoad load={props.frh}/></div></div>
      </div>
      <div style={{width:'100%', overflow:'hidden'}}>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}></div></div>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}><CircleLoad load={props.flv}/></div></div>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}><CircleLoad load={props.frv}/></div></div>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}></div></div>
      </div>
      <div style={{width:'100%', overflow:'hidden'}}>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}></div></div>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}><CircleLoad load={props.alv}/></div></div>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}><CircleLoad load={props.arv}/></div></div>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}></div></div>
      </div>
      <div style={{width:'100%', overflow:'hidden'}}>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}><CircleLoad load={props.alh}/></div></div>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}></div></div>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}></div></div>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}><CircleLoad load={props.arh}/></div></div>
      </div>
    </div>
  )
}

export default ThrustersLoad
