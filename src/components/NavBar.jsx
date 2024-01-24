import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button'; // Import Button component
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function NavBar() {
  const username = localStorage.getItem('username');
  const handleLogout = () => {

    // Clear the stored token
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    // Redirect to the login page
    window.location.href = '/'
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/home">Sound Level Monitoring</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            
            <Nav.Link><Link style={{color: 'white', textDecoration: 'none'}} to={"/home"}>Home</Link></Nav.Link>
            <Nav.Link><Link style={{color: 'white', textDecoration: 'none'}} to={"/devices"}>Devices Manager</Link></Nav.Link>
          </Nav>
        
        <Navbar className="xl-auto">
          <Navbar.Text style={{ color: 'white', paddingRight: 20 }} >
            Signed in as: {username}
          </Navbar.Text>

        </Navbar>
        <Navbar className="xl-auto">

          <Button variant="outline-light" onClick={handleLogout}>
            Sign Out
          </Button>
        </Navbar>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
