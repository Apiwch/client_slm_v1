import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "./DeviceList.css";
import ProgressBar from 'react-bootstrap/ProgressBar';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';

function DeviceList({ messages, onItemClicked, loading }) {


    const alertClicked = (name) => {
        onItemClicked(name); // Call the callback function with the selected device name
    };

    return (

        <div className="scrollbar scrollbar-primary " >
            <ListGroup style={{ height: 472 }}>
                {loading ?<h2><Spinner animation="border" variant="primary"/>loading</h2> :
                    messages.map((message, index) => (
                        <ListGroup.Item variant={message.status === 'Offline' ? 'danger' : 'primary'} key={index} action onClick={() => alertClicked(message.name)}>
                            <Row>
                                <Col>
                                    <strong>Device Name:</strong> {message.name}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <strong>Sound Level:</strong> {message.value + ' dBA'}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <ProgressBar min={40} max={90} now={message.value} />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <strong>Status:</strong> {message.status}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <strong>Battery:</strong> {message.batt + '%'}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <strong>Last Update:</strong> {message.timestamp}
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))
                }

            </ListGroup>
        </div>

    );
}

export default DeviceList;
