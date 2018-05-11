import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Jumbotron, Form, FormGroup, Label, Input, FormText, Card, CardImg, CardTitle, CardText, CardColumns,
 CardSubtitle, CardBody } from 'reactstrap';

export function ServerBindSocketListeners(data) {
  data.sock.on('connectionVerified', () => {data = data.getState(); data.verified = true; data.verificationfail = false; data.updateState(data)});
  data.sock.on('connectionNotVerified', () => {data = data.getState(); data.verified = false; data.updateState(data)});
  data.sock.on('connect', () => {data = data.getState(); data.healthy = true; data.updateState(data); data.sock.emit('verifyMe', 'passwd')});
  data.sock.on('disconnect', () => {data = data.getState(); data.healthy = false; data.updateState(data)})
  data.sock.on('downstreamConfigs', (configs) => {data = data.getState(); data.configs = configs; data.updateState(data)})
}

export function DefaultServerConfig(updateState, getState, sock) {
  return {
    updateState: updateState,
    getState: getState,
    sock: sock,
    passwd: '',
    verified: false,
    verificationfail: false,
    healthy: false,
    healthycolor: '#0dee24',
    unhealthycolor: '#ee650d',
    activecolor: '#0d82ee',
    configs: {
      canbus: {
        healthy: false,
        active: false
      },
      motorcontrollers: {
        healthy: false,
        active: false
      },
      powersupply: {
        healthy: false,
        active: false
      },
      sensors: {
        healthy: false,
        active: false
      }
    }
  }
};

export const VerificationBox = (props) => {
  return (
    <form onSubmit={(e) => {e.preventDefault(); props.data.updateState(props.data); props.data.sock.emit('verifyMe', props.data.passwd)}}>
      <FormGroup>
        <Label for="pass">Enter password to verify access to server</Label>
        <Input id="pass" type="password" placeholder="Password" onChange={(e) => {props.data.passwd = e.target.value}}/>
      </FormGroup>
      <FormGroup>
      <Button outline color="primary">Connect</Button>{' '}
      </FormGroup>
    </form>
  )
}

const ServerCard = (props) => {
  var data = props.data;
  return (
    <Card style={{borderLeft: ('5px solid ').concat(data.healthy ? (data.verified ? data.activecolor : data.healthycolor) : data.unhealthycolor)}}>
      <CardBody>
        <CardTitle>Main server settings</CardTitle>
        <CardSubtitle>Status: {data.healthy ? (data.verified ? 'Verified' : 'Healthy') : 'Unhealthy'}</CardSubtitle>
        <hr className="my-2" />
        {
          data.verified
            ?
              <div>
                <Button
                  outline
                  color="primary"
                  onClick={() => {
                    data = data.getState();
                    data.verified = false;
                    data.updateState(data);
                    data.sock.emit('verifyMe', 'passwd');
                  }}>Verify connection</Button>
              </div>
            : <VerificationBox data={data}/>
        }
      </CardBody>
    </Card>
  )
}

const CanbusCard = (props) => {
  const data = props.data;
  const configs = data.configs;
  return (
    <Card style={{borderLeft: ('5px solid ').concat(configs.canbus.healthy ? (configs.canbus.active ? data.activecolor : data.healthycolor) : data.unhealthycolor)}}>
      <CardBody>
        <CardTitle>CAN-bus</CardTitle>
        <CardSubtitle>Status: {configs.canbus.healthy ? (configs.canbus.active ? 'Active' : 'Healthy') : 'Unhealthy'}</CardSubtitle>
        <hr className="my-2" />
        <Button outline color={configs.canbus.active ? 'danger' : 'primary'} onClick={() => {data.configs.canbus.active ^= true; data.sock.emit('upstreamConfigs', data.configs)}}>{data.configs.canbus.active ? 'Deactivate' : 'Activate'}</Button>
      </CardBody>
    </Card>
  )
}

const MotorcontrollersCard = (props) => {
  const data = props.data;
  const config = data.configs.motorcontrollers;
  return (
    <Card style={{borderLeft: ('5px solid ').concat(config.healthy ? (config.active ? data.activecolor : data.healthycolor) : data.unhealthycolor)}}>
      <CardBody>
        <CardTitle>Motorcontrollers</CardTitle>
        <CardSubtitle>Status: {config.healthy ? (config.active ? 'Active' : 'Healthy') : 'Unhealthy'}</CardSubtitle>
        <hr className="my-2" />
      </CardBody>
    </Card>
  )
}

const PowersupplyCard = (props) => {
  const data = props.data;
  const config = data.configs.powersupply;
  return (
    <Card style={{borderLeft: ('5px solid ').concat(config.healthy ? (config.active ? data.activecolor : data.healthycolor) : data.unhealthycolor)}}>
      <CardBody>
        <CardTitle>Power supply</CardTitle>
        <CardSubtitle>Status: {config.healthy ? (config.active ? 'Active' : 'Healthy') : 'Unhealthy'}</CardSubtitle>
        <hr className="my-2" />
      </CardBody>
    </Card>
  )
}

const SensorsCard = (props) => {
  const data = props.data;
  const config = data.configs.sensors;
  return (
    <Card style={{borderLeft: ('5px solid ').concat(config.healthy ? (config.active ? data.activecolor : data.healthycolor) : data.unhealthycolor)}}>
      <CardBody>
        <CardTitle>Sensors</CardTitle>
        <CardSubtitle>Status: {config.healthy ? (config.active ? 'Active' : 'Healthy') : 'Unhealthy'}</CardSubtitle>
        <hr className="my-2" />
      </CardBody>
    </Card>
  )
}

const ServerSettingsView = (props) => {
  return (
    <div>
      <CardColumns>
        <ServerCard data={props.data}/>
        {
          props.data.verified ?
            <div>
              <CanbusCard data={props.data}/>
              <MotorcontrollersCard data={props.data}/>
              <PowersupplyCard data={props.data}/>
              <SensorsCard data={props.data}/>
            </div>
            : null
        }
      </CardColumns>
    </div>
  )
}

export const ServerView = (props) => {
  return (
    <div style={{padding:'20px'}}>
      <h1 className="display-3">{"Server"}</h1>
      <CardColumns>
        <ServerCard data={props.data}/>
        {
          props.data.verified ?
            <div>
              <CanbusCard data={props.data}/>
              <MotorcontrollersCard data={props.data}/>
              <PowersupplyCard data={props.data}/>
              <SensorsCard data={props.data}/>
            </div>
            : null
        }
      </CardColumns>
    </div>
  )
}

export default ServerView
