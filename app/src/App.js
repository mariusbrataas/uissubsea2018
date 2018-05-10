// Basic imports
import React, { Component } from 'react';
import './App.css';

// 3rd party libraries
import GamepadListener from './gamepad.js/dist/gamepad.js';
import openSocket from 'socket.io-client';

// View handlers
import {BaseNavBar, DefaultNavBarConfig} from './BaseNavBar.js';
import {WelcomeView, DefaultWelcomeConfig} from './welcome/WelcomeView.js';
import {DashboardView, DefaultDashboardConfig} from './dashboard/DashboardView.js';
import {ControllersView, DefaultControllersConfig, DefaultControllerConfig} from './controllers/ControllersView.js';
import {ServerView, DefaultServerConfig, ServerBindSocketListeners} from './server/ServerView.js';
import {PowersupplyView, DefaultPowersupplyConfig} from './powersupply/PowersupplyView.js';
import {MotorcontrollersView, DefaultMotorcontrollersConfig} from './motorcontrollers/MotorcontrollersView.js';
import {SensorsView, DefaultSensorsConfig} from './sensors/SensorsView.js';
import {CanbusView, DefaultCanbusConfig} from './canbus/CanbusView.js';
import {FrontcenterView, DefaultFrontcenterConfig} from './cameras/FrontcenterView.js';
import {FrontleftView, DefaultFrontleftConfig} from './cameras/FrontleftView.js';
import {FrontrightView, DefaultFrontrightConfig} from './cameras/FrontrightView.js';
import {AftView, DefaultAftConfig} from './cameras/AftView.js';

// Functions
import {TranslateXboxAxis, index2XboxBtn, index2XboxAxis} from './controllers/TranslateXbox.js';
import TransferToThrusters from './controllers/TransferToThrusters.js';
import TranslateToAction from './controllers/TranslateToAction.js';

class App extends Component {
  constructor(props) {
    // Basic settings
    super(props);
    // Binding class methods
    this.setNavState = this.setNavState.bind(this);
    this.setContState = this.setContState.bind(this);
    this.setServerState = this.setServerState.bind(this);
    this.getNavState = this.getNavState.bind(this);
    this.getContState = this.getContState.bind(this);
    this.getServerState = this.getServerState.bind(this);
    this.lookForControllers = this.lookForControllers.bind(this);
    this.handleControllerAxis = this.handleControllerAxis.bind(this);
    this.handleControllerButton = this.handleControllerButton.bind(this);
    // Socket
    this.sock = openSocket('http://192.168.1.92:8000');
    // Game controllers listener
    this.listener = new GamepadListener({analog: true, precision:6});
    // Building state library
    this.state = {
      navState:               DefaultNavBarConfig(this.setNavState, this.getNavState),
      welcomeState:           DefaultWelcomeConfig(),
      dashState:              DefaultDashboardConfig(),
      contState:              DefaultControllersConfig(this.setContState, this.getContState),
      serverState:            DefaultServerConfig(this.setServerState, this.getServerState, this.sock),
      powersupplyState:       DefaultPowersupplyConfig(),
      motorcontrollersState:  DefaultMotorcontrollersConfig(),
      sensorsState:           DefaultSensorsConfig(),
      canbusState:            DefaultCanbusConfig(),
      frontcenterState:       DefaultFrontcenterConfig(),
      frontleftState:         DefaultFrontleftConfig(),
      frontrightState:        DefaultFrontrightConfig(),
      aftState:               DefaultAftConfig(),
    };
    // Binding socket event handlers
    ServerBindSocketListeners(this.state.serverState)
    // Binding listener event handlers
    this.listener.on('gamepad:connected', (e) => this.lookForControllers(e));
    this.listener.on('gamepad:disconnected', (e) => this.lookForControllers(e));
    this.listener.on('gamepad:axis', (e) => this.handleControllerAxis(e));
    this.listener.on('gamepad:button', (e) => this.handleControllerButton(e));
    // Startup routines
    this.listener.start();
    this.lookForControllers();
    window.addEventListener('load', this.lookForControllers);
  };
  // Gamepad helpers
  lookForControllers() {
    console.log('Look for controllers')
    const rawpads = this.listener.getGamepads();
    var indexes = {}
    for (var i = 0; i < rawpads.length; i++) {
      if (rawpads[i]) {
        indexes[rawpads[i].index] = null;
        if (!(rawpads[i].index in this.state.contState.controllers)) {
          console.log('Rawpad index', rawpads[i].index)
          this.state.contState.controllers[rawpads[i].index] = DefaultControllerConfig(rawpads[i].index)
        }
      }
    }
    Object.keys(this.state.contState.controllers).map((key) => {
      if (!(key in indexes)) {delete this.state.contState.controllers[key]}
    })
    this.setContState(this.state.contState)
  };
  handleControllerAxis(e) {
    // event -> smooth data -> choose controller config -> assign data based on config -> translate to normalized -> transform to thruster power
    const config = this.state.contState.controllers[e.detail.gamepad.index];
    if (config) {
      if (config.engage) {
          const translated = TranslateXboxAxis(e, config);
          const transfers = TransferToThrusters(translated);
      }
    }
  };
  handleControllerButton(e) {
    const config = this.state.contState.controllers[e.detail.gamepad.index];
    if (config) {
      if (config.engage) {
        if (e.detail.index == 6 || e.detail.index == 7) {
          this.handleControllerAxis(e);
        } else {
          const designator = config.buttons.designators[index2XboxBtn(e.detail.index)]
          if (designator.engage) {
            if (designator.current == 'Go up' || designator.current == 'Go down' || designator.current == 'Go left' || designator.current == 'Go right') {
              this.handleControllerAxis(e);
            } else {
              if (e.detail.value == 1) {
                TranslateToAction(designator.current, config, this.sock);
              }
            }
          }
        }
      }
    }
  }
  // State setters
  setContState(contState) {this.setState({contState})};
  setNavState(navState) {this.setState({navState})};
  setServerState(serverState) {this.setState({serverState})};
  getContState() {return this.state.contState};
  getNavState() {return this.state.navState};
  getServerState() {return this.state.serverState};
  render() {
    switch (this.state.navState.selected) {
      case 'welcome':           return <ViewRenderer navState={this.state.navState} viewhandler={WelcomeView} data={this.state.welcomeState} serverdata={this.state.serverState}/>
      case 'dashboard':         return <ViewRenderer navState={this.state.navState} viewhandler={DashboardView} data={this.state.dashState}/>
      case 'controllers':       return <ViewRenderer navState={this.state.navState} viewhandler={ControllersView} data={this.state.contState}/>
      case 'server':            return <ViewRenderer navState={this.state.navState} viewhandler={ServerView} data={this.state.serverState}/>
      case 'powersupply':       return <ViewRenderer navState={this.state.navState} viewhandler={PowersupplyView} data={this.state.powersupplyState}/>
      case 'motorcontrollers':  return <ViewRenderer navState={this.state.navState} viewhandler={MotorcontrollersView} data={this.state.motorcontrollersState}/>
      case 'sensors':           return <ViewRenderer navState={this.state.navState} viewhandler={SensorsView} data={this.state.sensorsState}/>
      case 'canbus':            return <ViewRenderer navState={this.state.navState} viewhandler={CanbusView} data={this.state.canbusState}/>
      case 'frontcenter':       return <ViewRenderer navState={this.state.navState} viewhandler={FrontcenterView} data={this.state.frontcenterState}/>
      case 'frontleft':         return <ViewRenderer navState={this.state.navState} viewhandler={FrontleftView} data={this.state.frontleftState}/>
      case 'frontright':        return <ViewRenderer navState={this.state.navState} viewhandler={FrontrightView} data={this.state.frontrightState}/>
      case 'aft':               return <ViewRenderer navState={this.state.navState} viewhandler={AftView} data={this.state.aftState}/>
      default: return <ViewRenderer navState={this.state.navState} viewhandler={DefaultViewHandler}/>
    }
  }
}

const DefaultViewHandler = (props) => {
  return <p>Default view</p>
}

const ViewRenderer = (props) => {
  return (
    <div>
      <BaseNavBar data={props.navState}/>
      <div className='mainFrame'>
        <props.viewhandler data={props.data} serverdata={props.serverdata ? props.serverdata : null} navdata={props.navState}/>
      </div>
    </div>
  )
}

export default App;