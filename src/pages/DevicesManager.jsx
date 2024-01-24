import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2'
import { MapContainer, Marker, Tooltip, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
})


function DevicesManager() {

    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [newDeviceName, setNewDeviceName] = useState('');
    const [newDeviceSerial, setNewDeviceSerial] = useState('');
    const [position, setPosition] = useState([13.8208712, 100.5132449]);
    const [lat, setLat] = useState('');
    const [lon, setLon] = useState('');
    const [id, setId] = useState('');
    const [addMessage, setAddMessage] = useState('')
    const username = localStorage.getItem('username');
    const [loginMessage, setLoginMessage] = useState('');

    useEffect(() => {
        // Fetch data from the protected route using the stored token
        const token = localStorage.getItem('token');
        axios.get('http://192.168.1.44:5000/api/home', { headers: { Authorization: token } })
            .then((response) => {
                setLoginMessage(response.data.loginMessage);
            })
            .catch((error) => {
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
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [addMessage]);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        setAddMessage('');
        setNewDeviceName('');
        setNewDeviceSerial('');
        setLat('');
        setLon('');
        setPosition([13.8208712, 100.5132449]);
    }
    const handleCloseUpdate = () => setShowUpdate(false);
    const handleShowUpdate = () => {
        setShowUpdate(true);
    }

    const HandleMoveMap = () => {

        const map = useMapEvents({
            move() {

                setPosition(map.getCenter())
                setLat(map.getCenter().lat)
                setLon(map.getCenter().lng)
            }
        })
        return null
    };

    const HandleAddDevice = (e) => {
        e.preventDefault();
        if (!lat && !lon) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please Seclect Location!",
            });
            return
        }
        axios.post('http://192.168.1.44:5000/api/newDevice', { newDeviceName, newDeviceSerial, lat, lon, username })
            .then((response) => {
                setAddMessage(response.data);
                setShow(false);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Device has been added",
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch((err) => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: err.response.data.addDeviceMessage,
                });
            })

    }

    const HandleDelDevice = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://192.168.1.44:5000/api/deleteDevice/${id}`)
                    .then((response) => {
                        setAddMessage(response.data);
                        Swal.fire({
                            title: "Deleted!",
                            text: response.data,
                            icon: "success"
                        });
                    })
                    .catch((err) => {
                        console.log(err)
                    })

            }
        });
    }

    const HandleUpdateDevice = (e) => {
        e.preventDefault()
        axios.put(`http://192.168.1.44:5000/api/updateDevice/${id}`, { newDeviceName, newDeviceSerial, lat, lon, username })
            .then((response) => {
                setAddMessage(response.data);
                setShow(false);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Device has been updated",
                    showConfirmButton: false,
                    timer: 1500
                });
                setShowUpdate(false)
            })
            .catch((err) => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: err.response.data.addDeviceMessage,
                });
            })
    }

    const HandleEditDevice = (name, serial, lat, lon, id) => {
        setAddMessage('');
        handleShowUpdate()
        setNewDeviceName(name)
        setNewDeviceSerial(serial)
        setLat(lat)
        setLon(lon)
        setId(id)

    }

    return (
        <div>

            <NavBar></NavBar>
            <Row style={{ margin: '5px' }}>
                <Col lg style={{ marginTop: '10px' }}>
                    <Card>
                        <Card.Header>Devices List</Card.Header>
                        <Card.Body>
                            <Button variant="success" onClick={handleShow} style={{ padding: 10, marginBottom: 20 }}>Add New Device</Button>
                            <Table striped bordered hover responsive >
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Serial Number</th>
                                        <th>Latitude</th>
                                        <th>Longitude</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((val, index) => {
                                        return (<tr key={index}>
                                            <td>{index}</td>
                                            <td>{val.name}</td>
                                            <td>{val.serial}</td>
                                            <td>{val.lat}</td>
                                            <td>{val.lon}</td>
                                            <td>
                                                <Button onClick={() => HandleEditDevice(val.name, val.serial, val.lat, val.lon, val.id)}>Edit</Button>{' '}
                                                <Button variant="danger" onClick={() => HandleDelDevice(val.id)}>Delete</Button>
                                            </td>
                                        </tr>)
                                    })}
                                </tbody>
                            </Table>

                            {/* add Device */}
                            <Modal
                                show={show}
                                onHide={handleClose}
                                backdrop="static"
                                keyboard={false}
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>Add New Device</Modal.Title>
                                </Modal.Header>
                                <form onSubmit={HandleAddDevice}>
                                    <Modal.Body>
                                        <div className="form-group mt-3">
                                            <label>Device Name</label>
                                            <input
                                                type="text"
                                                className="form-control mt-1"
                                                placeholder="Enter Device Name"
                                                required
                                                value={newDeviceName}
                                                onChange={(e) => setNewDeviceName(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group mt-3">
                                            <label>Device Serial Number</label>
                                            <input
                                                type="text"
                                                className="form-control mt-1"
                                                placeholder="Enter Device Serial Number"
                                                required
                                                value={newDeviceSerial}
                                                onChange={(e) => setNewDeviceSerial(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group mt-3">
                                            <label>Select Location</label>
                                            <MapContainer style={{ height: 300 }} center={[13.8208712, 100.5132449]} zoom={5} scrollWheelZoom={false} >
                                                <TileLayer
                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                />
                                                <HandleMoveMap></HandleMoveMap>
                                                <Marker position={position}>
                                                </Marker>
                                            </MapContainer>
                                        </div>

                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleClose}>
                                            Close
                                        </Button>
                                        <Button type="submit" variant="primary" >Add</Button>
                                    </Modal.Footer>
                                </form>

                            </Modal>
                            {/* add Device */}

                            {/* update Device */}
                            <Modal
                                show={showUpdate}
                                onHide={handleCloseUpdate}
                                backdrop="static"
                                keyboard={false}
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>Edit Device</Modal.Title>
                                </Modal.Header>
                                <form onSubmit={HandleUpdateDevice}>
                                    <Modal.Body>
                                        <div className="form-group mt-3">
                                            <label>Device Name</label>
                                            <input
                                                type="text"
                                                className="form-control mt-1"
                                                placeholder="Enter Device Name"
                                                required
                                                value={newDeviceName}
                                                onChange={(e) => setNewDeviceName(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group mt-3">
                                            <label>Device Serial Number</label>
                                            <input
                                                type="text"
                                                className="form-control mt-1"
                                                placeholder="Enter Device Serial Number"
                                                required
                                                value={newDeviceSerial}
                                                onChange={(e) => setNewDeviceSerial(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group mt-3">
                                            <label>Select Location</label>
                                            <MapContainer style={{ height: 300 }} center={[lat, lon]} zoom={5} scrollWheelZoom={false} >
                                                <TileLayer
                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                />
                                                <HandleMoveMap></HandleMoveMap>
                                                <Marker position={position}>
                                                </Marker>
                                            </MapContainer>
                                        </div>

                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleCloseUpdate}>
                                            Close
                                        </Button>
                                        <Button type='submit' variant="primary">Save</Button>
                                    </Modal.Footer>
                                </form>
                            </Modal>
                            {/* update Device */}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>



        </div>
    )
}

export default DevicesManager
