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
import { useNavigate, Link } from 'react-router-dom';
import "./Home.css"
import "leaflet/dist/leaflet.css";





function Home() {
  const navigate = useNavigate(); 
  const username = localStorage.getItem('username');
  const [loginMessage, setLoginMessage] = useState('');
  const [devices, setDevices] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLogin = async () =>{
    try{
      const response = await axios.get('http://192.168.1.44:5000/api/home', { headers: { Authorization: token } })
      setLoginMessage(response.data.loginMessage)
    }catch(err){
      console.error('Failed to fetch data:', error.response.data.loginMessage);
      if (error.response.status === 401) {
        navigate('/')
      }
      if (error.response.status === 400) {
        navigate('/')
      }
    }
  }

  const fetchDevice = async () =>{
    try{
      setLoading(true);
      const response = await axios.get(`http://192.168.1.44:5000/api/Devices/${username}`);
      setDevices(response.data);
    }catch(err){
      console.error('Error fetching data:', err);
    }finally{
      setLoading(false);
    }
  } 

  useEffect(() => {
    fetchLogin();
    fetchDevice();
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
            <Card.Header>Devices List</Card.Header>
            <Card.Body>
              <DeviceList messages={messages} onItemClicked={handleItemClick} loading={loading}></DeviceList>
              <Button variant="primary" style={{ marginTop: '10px' }}><Link style={{color: 'white', textDecoration: 'none'}} to={"/devices"}>Devices Manager</Link></Button>
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
