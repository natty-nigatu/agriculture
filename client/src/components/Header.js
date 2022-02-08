import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import React from "react";

function Header() {
    const auth = useAuth();
    
    const loggedIn = Object.keys(auth.get).length !== 0;
    return (
        <>
            <Navbar bg="warning" expand="md">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        Import<span className="text-danger">ET</span>
                    </Navbar.Brand>
                    {loggedIn ? (
                        <>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="me-auto w-100">
                                    <Nav.Link as={Link} to="/">
                                        Home
                                    </Nav.Link>
                                    <Nav.Link as={Link} to="/account">
                                        Account
                                    </Nav.Link>
                                    <Nav.Link
                                        as={Link}
                                        to="/logout"
                                        className="ms-auto"
                                    >
                                        Log Out
                                    </Nav.Link>
                                </Nav>
                            </Navbar.Collapse>
                        </>
                    ) : null}
                </Container>
            </Navbar>
        </>
    );
}

export default Header;
