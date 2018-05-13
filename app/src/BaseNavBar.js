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
    this.camerasToggle = this.camerasToggle.bind(this);
    this.state = props.data;
    this.serverdata = props.serverdata;
  };
  toggle() {this.setState({isOpen: !this.state.isOpen})}
  camerasToggle() {this.setState({camerasOpen: !this.state.camerasOpen})}
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
                <ButtonDropdown isOpen={this.state.camerasOpen} toggle={this.camerasToggle} style={{padding:'0px 2px'}}>
                  <DropdownToggle outline caret color="primary">
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
