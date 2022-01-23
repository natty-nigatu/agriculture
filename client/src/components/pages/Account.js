import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Container, Spinner, Alert, Form, Card, Button } from "react-bootstrap";
import axios from "axios";
import host from "../../host";

function Account() {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState({});
    const [errorPass, setErrorPass] = useState(null);
    const [errorInfo, setErrorInfo] = useState(null);

    const auth = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [TIN, setTIN] = useState("");

    const passwordRef = useRef();
    const newPasswordRef = useRef();
    const confirmRef = useRef();

    useEffect(() => {
        let loggedInUser;
        if (Object.keys(auth.get).length === 0) {
            try {
                const loggedString = localStorage.getItem("loggedInUser");
                if (loggedString.trim().length === 0) return navigate("/login");
                loggedInUser = JSON.parse(loggedString);
            } catch {
                return navigate("/login");
            }

            auth.set((prev) => loggedInUser);
        } else getData();
    }, [auth]);

    function getData() {
        const token = auth.get.token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const id = auth.get.id;
        const type = auth.get.type;

        axios
            .post(`${host}/user`, { id, type })
            .then((res) => {
                if (res.data) {
                    setUser(res.data[0]);
                    setName(res.data[0].name);
                    res.data[0].TIN === null
                        ? setTIN("")
                        : setTIN(res.data[0].TIN);
                    setIsLoading(false);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function executeChangePassword(e) {
        e.preventDefault();
        setErrorPass(null);

        const user = {
            type: auth.get.type,
            username: auth.get.username,
            password: passwordRef.current.value.trim(),
            newPassword: newPasswordRef.current.value.trim(),
            confirm: confirmRef.current.value.trim(),
        };

        if (user.password.length < 8)
            return setErrorPass("Current Password is too short.");
        if (user.newPassword.length < 8)
            return setErrorPass("New Password is too short.");
        if (user.newPassword !== user.confirm)
            return setErrorPass("Passwords don't match.");

        delete user.confirm;

        axios
            .post(`${host}/changepassword`, user)
            .then((res) => {
                navigate(0);
            })
            .catch((error) => {
                if (error.response.status === 400)
                    return setErrorPass(
                        "Current password is incorrect."
                    );
                return setErrorPass(
                    "Cannot update information, an error occured. "
                );
            });
    }
    function executeChangeInformation(e) {
        e.preventDefault();
        setErrorInfo(null);

        if (name.trim().length < 5) return setErrorInfo("Name is too short.");

        const data = { name: name.trim(), id: auth.get.id };

        if (TIN.trim().length > 0) data.TIN = TIN;

        axios
            .patch(`${host}/user`, data)
            .then((res) => {
                navigate(0);
            })
            .catch((error) => {
                console.log(error);
                return setErrorInfo(
                    "Cannot update information, an error occured. "
                );
            });
    }

    return isLoading ? (
        <div className="w-100 text-center mt-5">
            <Spinner animation="grow" variant="warning" />
        </div>
    ) : (
        <Container className="px-5" style={{ maxWidth: "1100px" }}>
            <div className="row mt-5">
                {auth.get.type === "user" && (
                    <div className="col">
                        <Card className="shadow border-0">
                            <Card.Body>
                                <h2 className="text-center mb-3 text-warning">
                                    Update User Information
                                </h2>
                                <Form>
                                    {errorInfo !== null && (
                                        <Alert variant="danger">
                                            {errorInfo}
                                        </Alert>
                                    )}

                                    <Form.Group id="name">
                                        <Form.Label>Legal Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group id="tin">
                                        <Form.Label>TIN Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={TIN}
                                            onChange={(e) =>
                                                setTIN(e.target.value)
                                            }
                                            required
                                        />
                                    </Form.Group>
                                    <Button
                                        className="w-100 mt-3 mb-2"
                                        type="submit"
                                        variant="warning"
                                        onClick={executeChangeInformation}
                                    >
                                        Update User Information
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </div>
                )}
                <div className="col">
                    <Card
                        className="shadow border-0 m-auto"
                        style={{ maxWidth: "500px" }}
                    >
                        <Card.Body>
                            <h2 className="text-center mb-3 text-warning">
                                Change Password
                            </h2>
                            <Form>
                                {errorPass !== null && (
                                    <Alert variant="danger">{errorPass}</Alert>
                                )}
                                <Form.Group id="username">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={user.username}
                                        required
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group id="password">
                                    <Form.Label>Current Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        ref={passwordRef}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group id="newpassword">
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        ref={newPasswordRef}
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
                                    onClick={executeChangePassword}
                                >
                                    Change Password
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </Container>
    );
}

export default Account;
