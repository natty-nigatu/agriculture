import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import React from "react";

function Header() {
    const auth = useAuth();
    const loggedIn = Object.keys(auth.get).length !== 0;
    return (
        <>
            <Navbar bg="warning" expand="md">
                <Container>
                    <Navbar.Brand href="/">
                        Import<span className="text-danger">ET</span>
                    </Navbar.Brand>
                    {loggedIn ? (
                        <>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="me-auto w-100">
                                    <Nav.Link href="#home">Home</Nav.Link>
                                    <Nav.Link href="#link">Link</Nav.Link>
                                    <NavDropdown
                                        className="ms-auto"
                                        title="Dropdown"
                                        id="basic-nav-dropdown"
                                    >
                                        <NavDropdown.Item href="#action/3.1">
                                            Action
                                        </NavDropdown.Item>
                                        <NavDropdown.Item href="#action/3.2">
                                            Another action
                                        </NavDropdown.Item>
                                        <NavDropdown.Item href="#action/3.3">
                                            Something
                                        </NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item href="#action/3.4">
                                            Separated link
                                        </NavDropdown.Item>
                                    </NavDropdown>
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
