// Importing dependencies
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {
  ButtonDropdown,
  Button,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';

/*
CONTENTS
- Helper
  - DefaultNavBarConfig
- Main class: BaseNavBar
  - constructor
  - toggle
  - camerasToggle
  - handleStartStopwatch
  - render
*/

// Helper: DefaultNavBarConfig
export function DefaultNavBarConfig(updateState) {
  return {
    title: 'UiS Subsea 2018',
    selected: 'welcome',
    isOpen: false,
    updateState: updateState,
    items: {
      website:    {value:'Website',   ref:'https://sites.google.com/view/uissubsea/'},
      github:     {value:'GitHub',    ref:'https://github.com/mariusbrataas/uissubsea2018'},
      linkedin:   {value:'LinkedIn',  ref:'https://www.linkedin.com/company/uis-subsea/'},
      facebook:   {value:'Facebook',  ref:'https://www.facebook.com/uissubsea/'},
    },
    views: {
      dashboard:  {value:'Dashboard'},
    },
    settingsOpen: false,
    tinyviewsItems: {
      frontcenter:  {value:'Front center cam'},
      frontleft:    {value:'Left cam'},
      frontright:   {value:'Right cam'},
      aft:          {value:'Aft cam'}
    },
    tinyviewsOpen: false,
    stopWatch: {
      intervalRef: null,
      seconds: null,
      current: "00:00",
      isActive: false
    }
  }
}

// Main class: BaseNavBar
export class BaseNavBar extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.camerasToggle = this.camerasToggle.bind(this);
    this.handleStartStopwatch = this.handleStartStopwatch.bind(this);
    this.state = props.data;
    this.serverdata = props.serverdata;
  };
  toggle() {this.setState({isOpen: !this.state.isOpen})}
  camerasToggle() {this.setState({tinyviewsOpen: !this.state.tinyviewsOpen})}
  handleStartStopwatch() {
    if (!this.state.stopWatch.isActive) {
      var m = '';
      var s = '';
      this.state.stopWatch.isActive = true;
      this.state.updateState(this.state);
      if (!(this.state.stopWatch.seconds)) {this.state.stopWatch.seconds = 0}
      this.state.stopWatch.intervalRef = setInterval(() => {
        this.state.stopWatch.seconds++;
        m = ''.concat(Math.floor(this.state.stopWatch.seconds/60));
        if (m.length == 1) {m = '0'.concat(m)};
        s = ''.concat(this.state.stopWatch.seconds % 60);
        if (s.length == 1) {s = '0'.concat(s)}
        this.state.stopWatch.current = ''.concat(m).concat(':').concat(s)
        this.state.updateState(this.state)
      }, 1000);
    }
  }
  render() {
    return (
      <div>
        <Navbar color="light" light expand="md" fixed='top'>
          <NavbarBrand onClick={() => {this.state.selected = 'welcome'; this.state.updateState(this.state)}}>{this.state.title}</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <div style={{padding:'2px 0px'}}>
                <Button
                  color='primary'
                  onClick={() => {
                    this.state.selected = 'dashboard';
                    this.state.updateState(this.state);
                  }}
                >Dashboard</Button>
              </div>
              <div style={{padding:'2px 0px'}}>
                <ButtonDropdown isOpen={this.state.tinyviewsOpen} toggle={this.camerasToggle} style={{padding:'0px 2px'}}>
                  <DropdownToggle outline caret color="primary">
                    Displays
                  </DropdownToggle>
                  <DropdownMenu right>
                    {
                      Object.keys(this.state.tinyviewsItems).map((key) => {
                        return (
                          <DropdownItem
                            onClick={() => {
                              this.state.selected = key;
                              this.state.isOpen = false;
                              this.state.updateState(this.state);
                            }}
                          >{this.state.tinyviewsItems[key].value}</DropdownItem>
                        )
                      })
                    }
                  </DropdownMenu>
                </ButtonDropdown>
              </div>
              <div style={{padding:'2px 0px'}}>
                <Button
                  outline
                  color='primary'
                  onClick={() => {
                    this.state.selected = 'controllers';
                    this.state.updateState(this.state);
                  }}
                >Controller settings</Button>
              </div>
            </Nav>
            <Nav className="mc-auto" navbar>
              <div style={{padding:'2px 0px'}}>
                <Button
                  outline
                  color={this.serverdata.healthy ? (this.serverdata.verified ? 'primary' : 'success') : 'danger'}
                  onClick={() => {
                    this.state.selected = 'server';
                    this.state.updateState(this.state);
                  }}
                >Server settings</Button>
              </div>
              {
                this.serverdata.verified ?
                  <div style={{padding:'2px 2px'}}>
                    <Button
                      outline
                      color='danger'
                      onClick={() => {
                        console.log('Emergency stop')
                      }}
                    >Emergency stop</Button>
                  </div>
                  : null
              }
            </Nav>
            {
              this.state.stopWatch.isActive ?
              <Nav className="ml-auto" navbar>
                <div style={{padding:'2px 2px'}}>
                  <Button
                    color='danger'
                    onClick={() => {
                      clearInterval(this.state.stopWatch.intervalRef);
                      this.state.stopWatch.isActive = false;
                      this.state.stopWatch.seconds = null;
                      this.state.stopWatch.current = "00:00";
                      this.state.updateState(this.state)
                    }}
                  >Stop</Button>
                </div>
                <div style={{padding:'2px 2px'}}>
                  <Button
                    color='secondary'
                    onClick={() => {
                      clearInterval(this.state.stopWatch.intervalRef);
                      this.state.stopWatch.isActive = false;
                      this.state.updateState(this.state)
                    }}
                  >Pause</Button>
                </div>
              </Nav>
              :
              <Nav className="ml-auto" navbar>
                <div>
                  <Button
                    color='success'
                    onClick={() => {
                      this.handleStartStopwatch()
                    }}
                  >Start</Button>
                </div>
              </Nav>
            }
            <div style={{marginLeft:'5px', width:'100px'}}>
              <NavbarBrand>{this.state.stopWatch.current}</NavbarBrand>
            </div>
          </Collapse>
        </Navbar>
      </div>
    )
  }
}
