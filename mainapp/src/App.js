// Basic imports
import React, { Component } from 'react';
import './App.css';

// 3rd part libraries
import GamepadListener from './gamepad.js/dist/gamepad.js'
import SideNav, { Nav, NavText } from 'react-sidenav';
import openSocket from 'socket.io-client';

// View handlers
import Dashboard from './dashboard/Dashboard.js';
import Serverstats from './serverstats/Serverstats.js';
import Controllers from './controllers/Controllers.js';
import Settings from './settings/Settings.js';
import Sensors from './sensors/Sensors.js';
import Powersupply from './powersupply/Powersupply.js';
import Canbus from './canbus/Canbus.js';

// Local functions
import choosecontroller from './controllers/Choosecontrollers.js';

// Main code
class App extends Component {
  constructor(props) {
    // Basic settings
    super(props);
    // Binding class methods
    this.mainMenuChooser        = this.mainMenuChooser.bind(this);
    this.heartStart             = this.heartStart.bind(this);
    this.heartStop              = this.heartStop.bind(this);
    this.setControllersState    = this.setControllersState.bind(this);
    this.handleControllerAxis   = this.handleControllerAxis.bind(this);
    this.handleControllerClick  = this.handleControllerClick.bind(this);
    this.lookForControllers     = this.lookForControllers.bind(this);
    this.heartUpdater           = this.heartUpdater.bind(this);
    this.setSettingsState       = this.setSettingsState.bind(this);
    this.setSensorState         = this.setSensorState.bind(this);
    this.setPowersupplyState    = this.setPowersupplyState.bind(this);
    this.setCanbusState         = this.setCanbusState.bind(this);
    this.pushControllersState   = this.pushControllersState.bind(this);
    this.pushSettingsState      = this.pushSettingsState.bind(this);
    this.pushSensorState        = this.pushSensorState.bind(this);
    this.pushPowersupplyState   = this.pushPowersupplyState.bind(this);
    this.pushCanbusState        = this.pushCanbusState.bind(this);
    // Socket
    this.sock = openSocket('http://192.168.1.238:8000');
    this.pulseGenerator = undefined;
    // Game controllers listener
    this.listener = new GamepadListener({analog: true, precision:0});
    // Building state library
    this.state = {
      opt: 'controllers',
      dashboarddata: {},
      dashboardmets: {},
      serverstats: {
        nclients: 0,
        lastHeartbeat: '',
        actHeartbeat: false,
        heartRate: 500,
        count: 0
      },
      servermets: {
        heartStart: this.heartStart,
        heartStop: this.heartStop
      },
      controllerdata: {
        gamepadIds: [],
        indexDesignations: {},
        idDesignations: {},
        designations: {'Nothing':null, 'Thrusters':null, 'Manipulator':null, 'Camera':null},
        selectedCont: ''
      },
      controllermets: {
        updateState: this.setControllersState
      },
      settingsdata: {
        activateCAN: false,
        save_sensordata: false,
        save_candata: false
      },
      settingsmets: {
        updateState: this.setSettingsState
      },
      sensordata: {},
      sensormets: {},
      powersupplydata: {},
      powersupplymets: {},
      canbusdata: {},
      canbusmets: {}
    };
    // Binding listener event handlers
    this.listener.on('gamepad:connected',    (event) => this.lookForControllers(event));
    this.listener.on('gamepad:disconnected', (event) => this.lookForControllers(event));
    this.listener.on('gamepad:button',       (event) => this.handleControllerClick(event));
    this.listener.on('gamepad:axis',         (event) => this.handleControllerAxis(event));
    // Binding socket event handlers
    this.sock.on('disconnect',          ()         => {alert('Lost connection to server!')})
    this.sock.on('heartbeat',           (newstuff) => {this.heartUpdater(newstuff)});
    this.sock.on('pullSettingsdata',    (newstuff) => {this.setSettingsState(newstuff)});
    this.sock.on('pullSensordata',      (newstuff) => {this.setSensorState(newstuff)});
    this.sock.on('pullPowersupplydata', (newstuff) => {this.setPowersupplyState(newstuff)});
    this.sock.on('pullCanbusdata',      (newstuff) => {this.setCanbusState(newstuff)});
    // Sidemenu
    this.sideMenu = () => (
        <div style={{background: '#2c3e50', color: '#ffffff', width: 200}}>
            <SideNav
              highlightColor='#ffffff'
              highlightBgColor='#00bcd4'
              hoverBgColor='#00d26d'
              defaultSelected={this.state.opt}
              onItemSelection={this.mainMenuChooser}>
              <Nav id='dashboard'>    <NavText>Dashboard</NavText>    </Nav>
              <Nav id='serverstats'>  <NavText>Server stats</NavText> </Nav>
              <Nav id='controllers'>  <NavText>Controllers</NavText>  </Nav>
              <Nav id='settings'>     <NavText>Settings</NavText>     </Nav>
              <Nav id='sensors'>      <NavText>Sensors</NavText>      </Nav>
              <Nav id='powersupply'>  <NavText>Power supply</NavText> </Nav>
              <Nav id='canbus'>       <NavText>CAN-bus</NavText>      </Nav>
            </SideNav>
        </div>
    )
    // Startup routines
    this.listener.start();
    this.sock.emit('pushFirst');
    this.lookForControllers();
    window.addEventListener('load', this.lookForControllers)
  };
  // Local methods
  mainMenuChooser() {this.setState({opt: arguments[0]})};
  lookForControllers() {
    this.rawpads = this.listener.getGamepads();
    this.gamepadIds = [];
    for (var i = 0; i < this.rawpads.length; i++) {
      if (this.rawpads[i]) {this.gamepadIds.push(this.rawpads[i].id)};
    };
    this.setState((prevState) => {
      var controllerdata = prevState.controllerdata;
      controllerdata.gamepadIds = this.gamepadIds;
      return {controllerdata};
    });
  };
  // Controller listeners
  handleControllerAxis(e)  {choosecontroller(e, this.state.controllerdata, this.sock, 'axis')};
  handleControllerClick(e) {choosecontroller(e, this.state.controllerdata, this.sock, 'button')};
  // State setters
  setControllersState(controllerdata)   {this.setState({controllerdata})};
  setSettingsState(settingsdata)        {this.setState({settingsdata})};
  setSensorState(sensordata)            {this.setState({sensordata})};
  setPowersupplyState(powersupplydata)  {this.setState({powersupplydata})};
  setCanbusState(canbusdata)            {this.setState({canbusdata})};
  // State pushers
  pushControllersState() {this.sock.emit('pushControllersState', this.state.controllerdata)};
  pushSettingsState()    {this.sock.emit('pushSettingsState',    this.state.settingsdata)};
  pushSensorState()      {this.sock.emit('pushSensorState',      this.state.sensordata)};
  pushPowersupplyState() {this.sock.emit('pushPowersupplyState', this.state.powersupplydata)};
  pushCanbusState()      {this.sock.emit('pushCanbusState',      this.state.canbusdata)};
  // Heartbeat
  heartStart() {
    this.setState((prevState) => {
      var serverstats = prevState.serverstats;
      serverstats.actHeartbeat = true;
      return {serverstats};
    });
    this.pulseGenerator = setInterval(() => {
      this.sock.emit('pullHeartbeat');
    }, 100);
  };
  heartStop() {
    this.setState((prevState) => {
      var serverstats = prevState.serverstats;
      serverstats.actHeartbeat = false;
      return {serverstats};
    });
    if (this.pulseGenerator) {clearInterval(this.pulseGenerator)};
  };
  heartUpdater(newstuff) {
    this.setState((prevState) => {
      var serverstats = prevState.serverstats;
      serverstats.lastHeartbeat = newstuff[0];
      serverstats.nclients = newstuff[1];
      return {serverstats};
    });
  };
  // Renderer
  render() {
    switch (this.state.opt) {
      case 'dashboard':   return <Defaultviewrender viewhandler={Dashboard}   data={this.state.controllerdata} mets={this.state.controllermets} sidemenu={this.sideMenu}/>
      case 'serverstats': return <Defaultviewrender viewhandler={Serverstats} data={this.state.serverstats}    mets={this.state.servermets}     sidemenu={this.sideMenu}/>
      case 'controllers': return <Defaultviewrender viewhandler={Controllers} data={this.state.controllerdata} mets={this.state.controllermets} sidemenu={this.sideMenu}/>
      case 'settings':    return <Defaultviewrender viewhandler={Settings}    data={this.state.controllerdata} mets={this.state.controllermets} sidemenu={this.sideMenu}/>
      case 'sensors':     return <Defaultviewrender viewhandler={Sensors}     data={this.state.controllerdata} mets={this.state.controllermets} sidemenu={this.sideMenu}/>
      case 'powersupply': return <Defaultviewrender viewhandler={Powersupply} data={this.state.controllerdata} mets={this.state.controllermets} sidemenu={this.sideMenu}/>
      case 'canbus':      return <Defaultviewrender viewhandler={Canbus}      data={this.state.controllerdata} mets={this.state.controllermets} sidemenu={this.sideMenu}/>
      default: return <p>Default view</p>
    };
  };
};

// View renderer
const Defaultviewrender = (props) => {
  return (
    <div className='fullFrame'>
      <div className='mainFrame'>
        <div className='mainSubFrame'>
          <props.viewhandler
            data = {props.data}
            mets = {props.mets}
          />
        </div>
      </div>
      <div className='sideMenu'>
        <props.sidemenu/>
      </div>
    </div>
  );
};

export default App;
