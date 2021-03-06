// Basic imports
import React, { Component } from 'react';
import './App.css';

// 3rd party libraries
import GamepadListener from './gamepad.js/dist/gamepad.js';
import openSocket from 'socket.io-client';

// Main view handlers
import {BaseNavBar, DefaultNavBarConfig} from './BaseNavBar.js';
import {WelcomeView, DefaultWelcomeConfig} from './welcome/WelcomeView.js';
import {DashboardView, DefaultDashboardConfig} from './dashboard/DashboardView.js';
import {ControllersView, DefaultControllersConfig, DefaultControllerConfig, ControllersBindSocketListeners} from './controllers/ControllersView.js';
import {ServerView, DefaultServerConfig, ServerBindSocketListeners} from './server/ServerView.js';
import {TouchStickView} from './touchstick/TouchStick.js';

// Camera view handlers
import {FrontcenterView, DefaultFrontcenterConfig} from './cameras/FrontcenterView.js';
import {FrontleftView, DefaultFrontleftConfig} from './cameras/FrontleftView.js';
import {FrontrightView, DefaultFrontrightConfig} from './cameras/FrontrightView.js';
import {AftView, DefaultAftConfig} from './cameras/AftView.js';

// Functions
import {TranslateXboxAxis, index2XboxBtn, index2XboxAxis} from './controllers/TranslateXbox.js';
import TransferToThrusters from './controllers/TransferToThrusters.js';
import TranslateToAction from './controllers/TranslateToAction.js';

/*
CONTENTS
- Main class: App
  - constructor
  - Basic thrust helpers
    - sendThrustData
    - paintThrustData
  - Gamepad helpers
    - lookForControllers
    - handleControllerAxis
    - handleControllerButton
  - Joystick emulators
    - camPosListener
  - State setters
    - setContState
    - setNavState
    - setServerState
    - setWelcomeState
  - State getters
    - getContState
    - getNavState
    - getServerState
    - getWelcomeState
  - render
- Helper
  - DefaultViewHandler
  - ViewRenderer
*/

// Main class
class App extends Component {
  constructor(props) {
    // Basic settings
    super(props);
    this.useDummy = true;
    this.lastSend = new Date();
    // Binding class methods
    this.setNavState = this.setNavState.bind(this);
    this.setContState = this.setContState.bind(this);
    this.setServerState = this.setServerState.bind(this);
    this.setWelcomeState = this.setWelcomeState.bind(this);
    this.setDashState = this.setDashState.bind(this);
    this.getNavState = this.getNavState.bind(this);
    this.getContState = this.getContState.bind(this);
    this.getServerState = this.getServerState.bind(this);
    this.getWelcomeState = this.getWelcomeState.bind(this);
    this.getDashState = this.getDashState.bind(this);
    this.lookForControllers = this.lookForControllers.bind(this);
    this.handleControllerAxis = this.handleControllerAxis.bind(this);
    this.handleControllerButton = this.handleControllerButton.bind(this);
    this.sendThrustData = this.sendThrustData.bind(this);
    this.paintThrustData = this.paintThrustData.bind(this);
    this.camPosListener = this.camPosListener.bind(this);
    this.leftStickListener = this.leftStickListener.bind(this);
    this.rightStickListener = this.rightStickListener.bind(this);
    this.centerStickListener = this.centerStickListener.bind(this);
    this.calcVirtualThrust = this.calcVirtualThrust.bind(this);
    // Stick variables
    this.leftX = 0.0;
    this.leftY = 0.0;
    this.rightX = 0.0;
    this.rightY = 0.0;
    // Socket
    this.sock = openSocket('http://192.168.1.254:8000');
    // Game controllers listener
    this.listener = new GamepadListener({analog: true, precision:6});
    // Building state library
    this.state = {
      navState:               DefaultNavBarConfig(this.setNavState, this.getNavState),
      welcomeState:           DefaultWelcomeConfig(this.setWelcomeState, this.getWelcomeState),
      dashState:              DefaultDashboardConfig(this.setDashState, this.getDashState, this.sendThrustData, this.camPosListener, this.leftStickListener, this.rightStickListener, this.centerStickListener),
      contState:              DefaultControllersConfig(this.setContState, this.getContState, this.sock),
      serverState:            DefaultServerConfig(this.setServerState, this.getServerState, this.sock),
      frontcenterState:       DefaultFrontcenterConfig(),
      frontleftState:         DefaultFrontleftConfig(),
      frontrightState:        DefaultFrontrightConfig(),
      aftState:               DefaultAftConfig(),
    };
    // Binding socket event handlers
    this.sock.on('paintThrusts', (thrusts) => {this.paintThrustData(thrusts)})
    ServerBindSocketListeners(this.state.serverState);
    ControllersBindSocketListeners(this.state.contState);
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
  // Basic thrust helpers
  sendThrustData(thrusts) {
    this.paintThrustData(thrusts)
    this.sock.emit('pushThrusts', thrusts)
  };
  paintThrustData(thrusts) {
    const dashState = this.state.dashState;
    dashState.loads = thrusts;
    this.setState({dashState});
  };
  // Gamepad helpers
  lookForControllers() {
    const rawpads = this.listener.getGamepads();
    var indexes = {}
    for (var i = 0; i < rawpads.length; i++) {
      if (rawpads[i]) {
        indexes[rawpads[i].index] = null;
        if (!(rawpads[i].index in this.state.contState.controllers)) {
          this.state.contState.controllers[rawpads[i].index] = DefaultControllerConfig(rawpads[i].index)
        }
      }
    }
    Object.keys(this.state.contState.controllers).map((key) => {
      if (!(key in indexes)) {delete this.state.contState.controllers[key]}
    })
    //this.state.contState.controllers[0] = DefaultControllerConfig(0)
    this.setContState(this.state.contState)
  };
  handleControllerAxis(e) {
    const config = this.state.contState.controllers[e.detail.gamepad.index];
    if (config) {
      if (config.engage) {
        const translated = TranslateXboxAxis(e, config);
        const transfers = TransferToThrusters(translated, 1);
        this.sendThrustData(transfers)
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
              this.sock.emit(designator.current, e.detail.pressed);
            }
          }
        }
      }
    }
  }
  // Joystick emulators
  camPosListener(manager) {
    manager.on('move', (e, stick) => {
      this.state.serverState.campan = 0.5+Math.max(-1, Math.min(1, (1/4)*Math.cos(stick.angle.radian)*stick.force))/2;
      this.state.serverState.camtilt = 1-(0.5+Math.max(-1, Math.min(1, (1/4)*Math.sin(stick.angle.radian)*stick.force))/2);
      this.setServerState(this.state.serverState)
      this.sock.emit('gpio',{cmd:'pan',data:this.state.serverState.campan})
      this.sock.emit('gpio',{cmd:'tilt',data:this.state.serverState.camtilt})
    })
  }
  leftStickListener(manager) {
    manager.on('move', (e, stick) => {
      this.leftX = Math.max(-1, Math.min(1, (1/2)*Math.cos(stick.angle.radian)*stick.force));
      this.leftY = Math.max(-1, Math.min(1, (1/2)*Math.sin(stick.angle.radian)*stick.force));
      const transfers = TransferToThrusters(this.calcVirtualThrust());
      this.sendThrustData(transfers);
    })
    manager.on('end', (e, stick) => {
      this.leftX = 0.0;
      this.leftY = 0.0;
      const transfers = TransferToThrusters(this.calcVirtualThrust(), 1);
      this.sendThrustData(transfers);
    })
  }
  rightStickListener(manager) {
    manager.on('move', (e, stick) => {
      this.rightX = Math.max(-1, Math.min(1, (1/2)*Math.cos(stick.angle.radian)*stick.force));
      this.rightY = Math.max(-1, Math.min(1, (1/2)*Math.sin(stick.angle.radian)*stick.force));
      const transfers = TransferToThrusters(this.calcVirtualThrust(), 1);
      this.sendThrustData(transfers);
    })
    manager.on('end', (e, stick) => {
      this.rightX = 0.0;
      this.rightY = 0.0;
      const transfers = TransferToThrusters(this.calcVirtualThrust());
      this.sendThrustData(transfers);
    })
  }
  centerStickListener(manager) {
    manager.on('move', (e, stick) => {
      this.centerX = Math.max(-1, Math.min(1, (1/4)*Math.cos(stick.angle.radian)*stick.force));
      this.centerY = Math.max(-1, Math.min(1, (1/4)*Math.sin(stick.angle.radian)*stick.force));
      const transfers = TransferToThrusters(this.calcVirtualThrust(), 1);
      this.sendThrustData(transfers);
    })
    manager.on('end', (e, stick) => {
      this.centerX = 0.0;
      this.centerY = 0.0;
      const transfers = TransferToThrusters(this.calcVirtualThrust());
      this.sendThrustData(transfers);
    })
  }
  calcVirtualThrust() {
    return {
      ROLL: 0.0,
      PITCH: this.rightY,
      LAT: this.leftX,
      LONG: this.leftY,
      VERT: 0.0,
      YAW: this.rightX,
    }
  }
  // State setters
  setContState(contState) {this.setState({contState})};
  setNavState(navState) {this.setState({navState})};
  setServerState(serverState) {this.setState({serverState})};
  setWelcomeState(welcomeState) {this.setState({welcomeState})};
  setDashState(dashState) {this.setState({dashState})};
  // State getters
  getContState() {return this.state.contState};
  getNavState() {return this.state.navState};
  getServerState() {return this.state.serverState};
  getWelcomeState() {return this.state.welcomeState};
  getDashState() {return this.state.dashState};
  // Renderer
  render() {
    switch (this.state.navState.selected) {
      case 'welcome':           return <ViewRenderer navState={this.state.navState} serverdata={this.state.serverState} viewhandler={WelcomeView} data={this.state.welcomeState}/>
      case 'dashboard':         return <ViewRenderer navState={this.state.navState} serverdata={this.state.serverState} viewhandler={DashboardView} data={this.state.dashState}/>
      case 'controllers':       return <ViewRenderer navState={this.state.navState} serverdata={this.state.serverState} viewhandler={ControllersView} data={this.state.contState}/>
      case 'server':            return <ViewRenderer navState={this.state.navState} serverdata={this.state.serverState} viewhandler={ServerView} data={this.state.serverState}/>
      case 'frontcenter':       return <ViewRenderer navState={this.state.navState} serverdata={this.state.serverState} viewhandler={FrontcenterView} data={this.state.frontcenterState}/>
      case 'frontleft':         return <ViewRenderer navState={this.state.navState} serverdata={this.state.serverState} viewhandler={FrontleftView} data={this.state.frontleftState}/>
      case 'frontright':        return <ViewRenderer navState={this.state.navState} serverdata={this.state.serverState} viewhandler={FrontrightView} data={this.state.frontrightState}/>
      case 'aft':               return <ViewRenderer navState={this.state.navState} serverdata={this.state.serverState} viewhandler={AftView} data={this.state.aftState}/>
      case 'touchstick':        return <ViewRenderer navState={this.state.navState} serverdata={this.state.serverState} viewhandler={TouchStickView} data={this.state.dashState}/>
      default: return <ViewRenderer navState={this.state.navState} viewhandler={DefaultViewHandler}/>
    }
  }
}

// Helper: DefaultViewHandler
const DefaultViewHandler = (props) => {
  return <p>Default view</p>
}

// Helper: ViewRenderer
const ViewRenderer = (props) => {
  return (
    <div>
      <BaseNavBar data={props.navState} serverdata={props.serverdata}/>
      <div className='mainFrame'>
        <props.viewhandler data={props.data} serverdata={props.serverdata ? props.serverdata : null} navdata={props.navState}/>
      </div>

    </div>
  )
}

export default App;
