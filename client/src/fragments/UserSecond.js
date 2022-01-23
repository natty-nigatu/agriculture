import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import UserWait from "./UserWait";
import { useAuth } from "../../contexts/AuthContext";
import { Button, Card, Container, Spinner } from "react-bootstrap";
import axios from "axios";
import host from "../../host";
import UserFirst from "./UserFirst";

function UserSecond({ id }) {
    const auth = useAuth();
    const [process, setProcess] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [reupload, setReupload] = useState(false);

    useEffect(() => {
        const token = auth.get.token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        axios
            .post(`${host}/process`, { id })
            .then((res) => {
                if (res.data) {
                    setProcess(res.data[0]);
                    setIsLoading(false);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return isLoading ? (
        <div className="w-100 text-center mt-5">
            <Spinner animation="grow" variant="warning" />
        </div>
    ) : process.status === 1 ? (
        <UserWait step="permit"></UserWait>
    ) : (
        <Container className="px-5" style={{ maxWidth: "1100px" }}>
            <Card className="my-5 shadow border-0">
                <Card.Body>
                    <div className="display-6">
                        Permit Request has been rejected for the following
                        reason.
                    </div>
                    <p className="display-6 fs-5 mt-4">
                        {process.rejectPermit}
                    </p>
                </Card.Body>
            </Card>
            {!reupload && (
                <Button
                    variant="warning"
                    className="w-100"
                    onClick={() => setReupload(true)}
                >
                    Re-upload Files
                </Button>
            )}
            {reupload && <UserFirst id={process.id} reupload={true} />}
        </Container>
    );
}

UserSecond.propTypes = {
    id: PropTypes.string.isRequired,
};
export default UserSecond;
