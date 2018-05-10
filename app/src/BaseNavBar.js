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
    settingItems: {
      server:             {value:'Server'},
      controllers:        {value:'Controllers'},
      powersupply:        {value:'Power supply'},
      motorcontrollers:   {value:'Motor controllers'},
      sensors:            {value:'Sensors'},
      canbus:             {value:'CAN-bus'}
    },
    settingsOpen: false,
    cameraItems: {
      frontcenter:  {value:'Front center'},
      frontleft:    {value:'Front left'},
      frontright:   {value:'Front right'},
      aft:          {value:'Aft'}
    },
    camerasOpen: false,
  }
}

export class BaseNavBar extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.settingsToggle = this.settingsToggle.bind(this);
    this.camerasToggle = this.camerasToggle.bind(this);
    this.state = props.data;
  };
  toggle() {this.setState({isOpen: !this.state.isOpen})}
  settingsToggle() {this.setState({settingsOpen: !this.state.settingsOpen})}
  camerasToggle() {this.setState({camerasOpen: !this.state.camerasOpen})}
  render() {
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand onClick={() => {this.state.selected = 'welcome'; this.state.updateState(this.state)}}>{this.state.title}</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="mr-auto" navbar>
              {
                Object.keys(this.state.views).map((key) => {
                  return (
                    <NavItem>
                      <NavLink
                        active
                        color='link'
                        onClick={() => {
                          this.state.selected = key;
                          this.state.isOpen = false;
                          this.state.updateState(this.state);
                        }}
                        href={this.state.views[key].ref}
                        target='_blank'
                      >{this.state.views[key].value}</NavLink>
                    </NavItem>
                  )
                })
              }
              <ButtonDropdown isOpen={this.state.camerasOpen} toggle={this.camerasToggle} style={{padding:'2px 2px'}}>
                <DropdownToggle caret color="primary">
                  Cameras
                </DropdownToggle>
                <DropdownMenu right>
                  {
                    Object.keys(this.state.cameraItems).map((key) => {
                      return (
                        <DropdownItem
                          onClick={() => {
                            this.state.selected = key;
                            this.state.isOpen = false;
                            this.state.updateState(this.state);
                          }}
                        >{this.state.cameraItems[key].value}</DropdownItem>
                      )
                    })
                  }
                </DropdownMenu>
              </ButtonDropdown>
              <ButtonDropdown isOpen={this.state.settingsOpen} toggle={this.settingsToggle} style={{padding:'2px 2px'}}>
                <DropdownToggle caret color="primary">
                  Settings
                </DropdownToggle>
                <DropdownMenu right>
                  {
                    Object.keys(this.state.settingItems).map((key) => {
                      return (
                        <DropdownItem
                          onClick={() => {
                            this.state.selected = key;
                            this.state.isOpen = false;
                            this.state.updateState(this.state);
                          }}
                        >{this.state.settingItems[key].value}</DropdownItem>
                      )
                    })
                  }
                </DropdownMenu>
              </ButtonDropdown>
            </Nav>
            <Nav className="ml-auto" navbar>
              {
                Object.keys(this.state.items).map((key) => {
                  return (
                    <NavItem>
                      <NavLink
                        href={this.state.items[key].ref}
                        target='_blank'
                      >{this.state.items[key].value}</NavLink>
                    </NavItem>
                  )
                })
              }
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    )
  }
}
