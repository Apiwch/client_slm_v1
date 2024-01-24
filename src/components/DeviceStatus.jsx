import React from 'react'
import Card from 'react-bootstrap/Card';

function DeviceStatus() {
  return (
    <Card bg="success" text="light" style={{ width: '18rem' }} className="mb-2">
    <Card.Header>All Devices Status</Card.Header>
    <Card.Body>
      <Card.Title>Total: 200</Card.Title>
      <Card.Title>Online: 200</Card.Title>
      <Card.Title>Offline: 0</Card.Title>

    </Card.Body>
  </Card>
  )
}

export default DeviceStatus