import { useRef, useState, useEffect } from "react";
import { Form, Button, Card, Container, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import host from "../host";
const axios = require("axios");

function Signup() {
    const auth = useAuth();
    const navigate = useNavigate();

    const [userCreated, setUserCreated] = useState(false);
    const [error, setError] = useState(null);

    const nameRef = useRef();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const confirmRef = useRef();

    useEffect(() => {
        let loggedInUser;
        if (Object.keys(auth.get).length === 0) {
            try {
                const loggedString = localStorage.getItem("loggedInUser");
                if (loggedString.trim().length === 0) return;
                loggedInUser = JSON.parse(loggedString);
            } catch {
                return;
            }

            auth.set((prev) => loggedInUser);
            return navigate("/");
        }
    }, []);

    function executeSignup(e) {
        e.preventDefault();
        setError(null);

        //verify
        const user = {
            name: nameRef.current.value.trim(),
            confirm: confirmRef.current.value.trim(),
            password: passwordRef.current.value.trim(),
            username: usernameRef.current.value.trim(),
            type: "user",
        };

        for (const property in user) {
            if (!user[property])
                return setError(`Cannot sign up, ${property} cannot be empty.`);
        }

        if (user.username.length < 5) return setError("Username is too short.");

        if (user.password.length < 8) return setError("Password is too short.");

        if (user.password !== user.confirm) {
            return setError("Passwords Don't Match.");
        }

        axios
            .post(`${host}/signup`, user)
            .then((res) => {
                return setUserCreated(true);
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.data === "taken")
                        return setError("Username is already taken.");
                }

                return setError("Cannot sign up, an error occured");
            });
    }

    return userCreated ? (
        <Container className="mt-5 pd-5" style={{ maxWidth: "500px" }}>
            <Card className="shadow border-0">
                <Card.Body className="my-4 text-center">
                    <h3 className="text-warning">
                        Account Created Successfully
                    </h3>
                    <h4 className="mt-4">Please Login to Continue</h4>
                    <Link to="login" className="btn btn-warning w-100 mt-4   ">
                        Log In
                    </Link>
                </Card.Body>
            </Card>
        </Container>
    ) : (
        <Container className="mt-5 pd-5" style={{ maxWidth: "500px" }}>
            <Card className="shadow border-0">
                <Card.Body>
                    <h2 className="text-center mb-3 text-warning">Sign Up</h2>
                    <Form>
                        {error !== null && (
                            <Alert variant="danger">{error}</Alert>
                        )}
                        <Form.Group id="name">
                            <Form.Label>Legal Name</Form.Label>
                            <Form.Control type="text" ref={nameRef} required />
                        </Form.Group>
                        <Form.Group id="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="username"
                                ref={usernameRef}
                                required
                            />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                ref={passwordRef}
                                required
                            />
                        </Form.Group>
                        <Form.Group id="confirm">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                ref={confirmRef}
                                required
                            />
                        </Form.Group>
                        <Button
                            className="w-100 mt-3 mb-2"
                            type="submit"
                            variant="warning"
                            onClick={executeSignup}
                        >
                            Sign Up
                        </Button>
                    </Form>
                </Card.Body>
            </Card>

            <div className="w-100 text-center mt-4">
                Aleady have an account?{" "}
                <Link to="/login" className="btn btn-warning">
                    Log In
                </Link>
            </div>
        </Container>
    );
}

export default Signup;
