import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../../contexts/AuthContext";
import { Container, Spinner, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import host from "../../host";
import desc from "../../descriptions";
import DownloadCard from "./DownloadCard";
import { useNavigate } from "react-router-dom";
import UploadCard from "./UploadCard";

function NBEProcess({ id }) {
    const auth = useAuth();
    const [process, setProcess] = useState({});
    const [accept, setAccept] = useState(true);
    const [user, setUser] = useState({});
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const refPermit = useRef();
    const refReason = useRef();

    useEffect(() => {
        const token = auth.get.token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        axios
            .post(`${host}/process`, { id })
            .then((res) => {
                if (res.data) {
                    setProcess(res.data[0]);

                    return axios.post(`${host}/user`, { id: res.data[0].user });
                }
            })
            .then((res) => {
                if (typeof res.data[0] === "object") {
                    setUser(res.data[0]);
                    setIsLoading(false);
                }
            })

            .catch((error) => {
                console.log(error);
            });
    }, []);

    function closeProcess() {
        const token = auth.get.token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const data = { id, status: 0 };

        axios
            .patch(`${host}/process`, data)
            .then((res) => {
                return navigate("/");
            })
            .catch((err) => {
                console.dir(err);
            });
    }

    function acceptRequest(e) {
        e.preventDefault();
        setError(null);

        const permit = refPermit.current.files[0];

        if (permit === undefined)
            return setError(
                desc.permitTitle + " needs to be attached to accept the request."
            );

        const token = auth.get.token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const fileIds = { id, step: 3, status: 1 };
        const data = new FormData();
        data.append("user", user.id);
        data.append("file", permit);

        axios
            .put(`${host}/file`, data)
            .then((res) => {
                fileIds.fPermit = res.data.id;

                return axios.patch(`${host}/process`, fileIds);
            })
            .then((res) => {
                navigate("/");
            })
            .catch((err) => {
                console.dir(err);
                return setError("Cannot upload permit, an error occured.");
            });
    }

    function rejectRequest(e) {
        e.preventDefault();
        setError(null);

        const rejectPermit = refReason.current.value.trim();

        if (rejectPermit.length === 0)
            return setError(
                "Rejection reason needs to be specified to reject the request."
            );

        const token = auth.get.token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const data = { id, status: -1, rejectPermit};

        axios
            .patch(`${host}/process`, data)
            .then((res) => {
                navigate("/");
            })
            .catch((err) => {
                console.dir(err);
                return setError("Cannot reject permit, an error occured.");
            });
    }

    return isLoading ? (
        <div className="w-100 text-center mt-5">
            <Spinner animation="grow" variant="warning" />
        </div>
    ) : (
        <Container className="px-5" style={{ maxWidth: "1100px" }}>
            <h1 className="display-6 fs-1 mt-4">Owner : {user.name}</h1>

            <div className="fs-4 mt-1">TIN: {user.TIN}</div>
            <div className="fs-4 mt-1">Process Name: {process.name}</div>

            <DownloadCard id={process.fLicense} name={desc.licenseTitle} />
            <DownloadCard id={process.fMoa} name={desc.moaTitle} />
            {process.fPre !== null && (
                <DownloadCard id={process.fPre} name={desc.preShipmentTitle} />
            )}
            <DownloadCard id={process.fProforma} name={desc.proformaTitle} />
            <DownloadCard id={process.fApproval} name={desc.approvalTitle} />

            {error && (
                <Alert className="mt-4" variant="danger">
                    {error}
                </Alert>
            )}

            {accept ? (
                <>
                    <UploadCard
                        title={desc.permitTitle}
                        description={desc.permitDesc}
                        refFile={refPermit}
                    />
                    <Button
                        variant="success"
                        className="w-100 mt-3"
                        onClick={acceptRequest}
                    >
                        Accept Permit Request
                    </Button>
                    <Button
                        variant="danger"
                        className="w-100 mt-3"
                        onClick={() => setAccept(false)}
                    >
                        Reject Permit Request
                    </Button>
                </>
            ) : (
                <>
                    <div className="display-6 fs-3 my-3">
                        Reason for rejection
                    </div>
                    <Form.Control as="textarea" rows={5} ref={refReason} />
                    <Button
                        variant="danger"
                        className="w-100 mt-3"
                        onClick={rejectRequest}
                    >
                        Reject Permit Request
                    </Button>
                    <Button
                        variant="success"
                        className="w-100 mt-3"
                        onClick={() => setAccept(true)}
                    >
                        Accept Permit Request
                    </Button>
                </>
            )}
        </Container>
    );
}

NBEProcess.propTypes = {
    id: PropTypes.string.isRequired,
};

export default NBEProcess;
