import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {
  Label
} from 'reactstrap';

var mathjs = require('mathjs')

function euclid(pos1, pos2) {
  const prettyPos = pos1.map((e, index) => {return [e, pos2[index]]});
  var diffs = prettyPos.map((e, index) => {return Math.pow(e[0] - e[1], 2)});
  return Math.sqrt(diffs.reduce((a, b) => a + b, 0));
}

function exprcalc(expr, x) {
  return mathjs.eval(String(expr).replace('x', x))
}

class track {
  constructor() {
    this.log = [];
    this.t = 0;
    this.pos = [0,0,0];
    this.dir = 0.0;
    this.step = this.step.bind(this);
    this.step2ground = this.step2ground.bind(this);
    this.getDirection = this.getDirection.bind(this);
    this.renderDirections = this.renderDirections.bind(this);
  }
  step(heading, airspeed, vertical, timedelta, windfrom, windspeed) {
    const rheading = heading;
    const rairspeed = airspeed;
    const rvertical = vertical;
    const rwindfrom = windfrom;
    const rwindspeed = windspeed;
    timedelta = Math.round(Math.abs(exprcalc(timedelta, this.t)));
    for (var i = 0; i < timedelta; i++) {
      // Plane
      var mheading = 90-exprcalc(rheading, this.t)
      var mangle = mheading * Math.PI / 180;
      airspeed = exprcalc(rairspeed, this.t);
      vertical = exprcalc(rvertical, this.t);
      const grndspeed = airspeed;
      const speedx = Math.cos(mangle) * grndspeed;
      const speedy = Math.sin(mangle) * grndspeed;
      // Wind
      windfrom = exprcalc(rwindfrom, this.t)
      var windto = (windfrom < 180 ? 360 : 0) + windfrom - 180;
      var windangle = (90 - windto) * Math.PI / 180;
      windspeed = exprcalc(rwindspeed, this.t)
      const windspeedx = Math.cos(windangle) * windspeed
      const windspeedy = Math.sin(windangle) * windspeed
      // Combined
      this.pos[0] += (speedx + windspeedx);
      this.pos[1] += (speedy + windspeedy);
      this.pos[2] += (vertical);
      this.log.push([this.pos[0], this.pos[1], this.pos[2]])
      this.t += 1;
    }
    this.dir = (this.pos[0] < 0 ? 180 : 0)+((Math.PI/2)-Math.atan(this.pos[1]/this.pos[0]))*(180/Math.PI)
  }
  step2ground(heading, airspeed, vertical, timedelta, windfrom, windspeed) {
    this.step(heading, airspeed, vertical, Math.abs(this.pos[2]/vertical), windfrom, windspeed)
  }
  getDirection() {
    return {'direction': this.dir, 'distance': euclid([0,0], [this.pos[0], this.pos[1]])}
  }
  renderDirections() {
    const lat = Math.round(this.pos[0])/1000;
    const lon = Math.round(this.pos[1])/1000;
    const deg = Math.round(this.getDirection()['direction']);
    const dis = Math.round(this.getDirection()['distance'])/1000;
    return (
      <div>
        <div><Label>Relative lateral position: {lat} km ({Math.round(1000*lat*0.539956803)/1000} NM)</Label></div>
        <div><Label>Relative longitudinal position: {lon} km ({Math.round(1000*lon*0.539956803)/1000} NM)</Label></div>
        <div><Label>Direction: {deg} degrees</Label></div>
        <div><Label>Distance: {dis} km ({Math.round(1000*dis*0.539956803)/1000} NM)</Label></div>
      </div>
    )
  }
}

export default track
