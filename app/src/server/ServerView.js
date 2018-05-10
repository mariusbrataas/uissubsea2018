import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

export function ServerBindSocketListeners(data) {
  data.sock.on('connectionVerified', () => {data.verified = true; data.verificationfail = false; data.updateState(data)});
  data.sock.on('connectionNotVerified', () => {data.verificationfail = true; data.updateState(data)});
  //data.sock.on('disconnect', () => {data.verified = false; data.updateState(data); alert('Lost connection to server!')})
}

export function DefaultServerConfig(updateState, sock) {
  return {
    updateState: updateState,
    sock: sock,
    passwd: '',
    verified: false,
    verificationfail: false,
  }
};

export const VerificationBox = (props) => {
  return (
    <form onSubmit={(e) => {e.preventDefault(); props.data.updateState(props.data); console.log('Submit', props.data.passwd); props.data.sock.emit('verifyMe', props.data.passwd)}} style={{width:'300px'}}>
      <FormGroup>
        <Label for="pass">Enter password to connect to server</Label>
        <Input id="pass" type="password" placeholder="Password" onChange={(e) => {props.data.passwd = e.target.value}}/>
      </FormGroup>
      <FormGroup>
      <Button outline color="primary">Connect</Button>{' '}
      </FormGroup>
    </form>
  )
}

export const ServerView = (props) => {
  const data = props.data;
  if (props.data.verified) {
    return (
      <div style={{padding:'20px'}}>
        <h1 className="display-3">{"Server"}</h1>
        <h5>Connection verified</h5>
      </div>
    )
  } else {
    return (
      <div style={{padding:'20px'}}>
        <h1 className="display-3">{"Server"}</h1>
        <div style={{width:'25%'}}><VerificationBox data={props.data}/></div>
      </div>
    )
  }
}

export default ServerView
