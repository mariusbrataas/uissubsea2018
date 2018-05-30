import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {
  Button,
  FormGroup,
  Label,
  Input,
  Card,
  CardTitle,
  CardColumns,
  CardDeck,
  CardSubtitle,
  CardBody,
  Nav
} from 'reactstrap';

export function ServerBindSocketListeners(data) {
  data.sock.on('connectionVerified', () => {
    data = data.getState();
    data.verified = true;
    data.verificationfail = false;
    data.updateState(data);
  });
  data.sock.on('connectionNotVerified', () => {
    data = data.getState();
    data.verified = false;
    data.updateState(data);
  });
  data.sock.on('connect', () => {
    data = data.getState();
    data.healthy = true;
    data.updateState(data);
    data.sock.volatile.emit('verifyMe', data.passwd);
  });
  data.sock.on('disconnect', () => {
    data = data.getState();
    data.healthy = false;
    data.updateState(data);
  })
  data.sock.on('downstreamConfigs', (configs) => {
    data = data.getState();
    data.configs = configs;
    data.updateState(data);
  })
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
        active: false,
        config: {
          flv: {title:'Front Left Vertical',    id:0, engage:false, status:{}}, // Front Left Vertical
          frv: {title:'Front Right Vertical',   id:0, engage:false, status:{}}, // Front Right Vertical
          alv: {title:'Aft Left Vertical',      id:0, engage:false, status:{}}, // Aft Left Vertical
          arv: {title:'Aft Right Vertical',     id:0, engage:false, status:{}}, // Aft Right Vertical
          flh: {title:'Front Left Horizontal',  id:0, engage:false, status:{}}, // Front Left Horizontal
          frh: {title:'Front Right Horizontal', id:0, engage:false, status:{}}, // Front Right Horizontal
          alh: {title:'Aft Left Horizontal',    id:0, engage:false, status:{}}, // Aft Left Horizontal
          arh: {title:'Aft Right Horizontal',   id:0, engage:false, status:{}}, // Aft Right Horizontal
        }
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
    <form onSubmit={(e) => {e.preventDefault(); props.data.updateState(props.data); props.data.sock.volatile.emit('verifyMe', props.data.passwd)}}>
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
                    data.sock.volatile.emit('verifyMe', 'passwd');
                  }}>Update data</Button>
              </div>
            : <VerificationBox data={data}/>
        }
      </CardBody>
    </Card>
  )
}

const CanbusCard = (props) => {
  const data = props.data;
  const config = data.configs.canbus;
  return (
    <Card style={{borderLeft: ('5px solid ').concat(config.healthy ? (config.active ? data.activecolor : data.healthycolor) : data.unhealthycolor)}}>
      <CardBody>
        <CardTitle>CAN-bus</CardTitle>
        <CardSubtitle>Status: {config.healthy ? (config.active ? 'Active' : 'Healthy') : 'Unhealthy'}</CardSubtitle>
        <hr className="my-2" />
        <div style={{maxHeight:'50vh', overflow:'scroll'}}>
          {
            Object.keys(config.config).map((key) => {
              var tmp = config.config[key]
              return (
                <div style={{paddingTop:'24px', marginLeft:'2px'}}>
                  <CardSubtitle>{tmp.title}</CardSubtitle>
                  <Nav>
                    <form onSubmit={(e) => {e.preventDefault(); var newdata = data.getState(); newdata.configs.canbus.config[key].id = tmp.id; data.sock.volatile.emit('upstreamConfigs', newdata.configs)}}>
                        <Label>Controller ID: {tmp.id}</Label>
                        <Input placeholder={tmp.id} onChange={(e) => {tmp.id = e.target.value}}/>
                      <FormGroup>
                      </FormGroup>
                    </form>
                  </Nav>
                  <hr className="my-2" />
                </div>
              )
            })
          }
        </div>
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
