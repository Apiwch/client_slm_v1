import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import NavBar from '../components/NavBar';
import DeviceList from '../components/DeviceList';
import DeviceMap from '../components/DeviceMap';
import AnotherComponent from '../components/AnotherComponent';
import axios from 'axios';
import "./Home.css"
import { CloseButton } from 'react-bootstrap';



function Home() {
  const username = localStorage.getItem('username');
  const [loginMessage, setLoginMessage] = useState('');
  const [devices, setDevices] = useState([]);
  const [messages, setMessages] = useState([]);






  useEffect(() => {
    // Fetch data from the protected route using the stored token
    const token = localStorage.getItem('token');
    axios.get('http://192.168.1.44:5000/api/home', { headers: { Authorization: token } })
      .then((response) => {
        setLoginMessage(response.data.loginMessage);
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error.response.data.loginMessage);
        if (error.response.status === 401) {
          window.location.href = '/'
        }
        if (error.response.status === 400) {
          window.location.href = '/'
        }
      });

  }, []);

  useEffect(() => {
    axios.get(`http://192.168.1.44:5000/api/Devices/${username}`)
      .then(response => {
        setDevices(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);


  useEffect(() => {
    const socket = new WebSocket('ws://192.168.1.44:5000');

    socket.onopen = () => {

    };

    socket.onmessage = (event) => {


      const receivedMessages = JSON.parse(event.data).map((message) => ({
        ...message,
        status: checkStatus(message),
      }));


      

      const filterMessage = receivedMessages.filter((el) => {
        return devices.some((f) => {
          if(f.name === el.name){
            el.lat = f.lat
            el.lon = f.lon
          }
          return f.name === el.name;
        });
      });

      setMessages(filterMessage);
    };

    socket.onclose = () => {

    };
    return () => {
      socket.close();
    };

  }, [devices]);

  function checkStatus(device) {
    const threeSecondsAgo = new Date();
    threeSecondsAgo.setSeconds(threeSecondsAgo.getSeconds() - 5);
    const { timestamp } = device;
    
 

    if (timestamp.split(' ')[1] <= threeSecondsAgo.toLocaleTimeString('en-US', { hour12: false })) {
      return 'Offline';
    } else {
      return 'Online';
    }
  }

  const [selectedDevice, setSelectedDevice] = useState('');

  const handleItemClick = (name) => {
    setSelectedDevice(name);
  };

  return (
    <div>
      <NavBar></NavBar>
      <Row style={{ margin: '5px' }}>
        <Col lg={4} style={{ marginTop: '10px' }}>
          <Card>
            <Card.Header>Device List</Card.Header>
            <Card.Body>
              <DeviceList messages={messages} onItemClicked={handleItemClick}></DeviceList>
              <Button variant="primary" style={{ marginTop: '10px' }} href='/DevicesManager'>Devices Manager</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col sm style={{ marginTop: '10px' }}>
          <Card>
            <Card.Header>Map</Card.Header>
            <Card.Body>
              <DeviceMap messages={messages} selectedDevice={selectedDevice}></DeviceMap>

            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row style={{ margin: '5px' }}>
        <Col sm style={{ marginTop: '10px' }}>
          <Card>
            <Card.Header>{selectedDevice} Graph</Card.Header>
            <Card.Body>
              <AnotherComponent selectedDevices={selectedDevice} messages={messages}></AnotherComponent>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Home
