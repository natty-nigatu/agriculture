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

        const clearance = refPermit.current.files[0];

        if (clearance === undefined)
            return setError(
                desc.clearanceTitle + " needs to be attached to accept the request."
            );

        const token = auth.get.token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const fileIds = { id, step: 5, status: 1 };
        const data = new FormData();
        data.append("user", user.id);
        data.append("file", clearance);

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

        const rejectClearance = refReason.current.value.trim();

        if (rejectClearance.length === 0)
            return setError(
                "Rejection Reason needs to be specified to reject the request."
            );

        const token = auth.get.token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const data = { id, status: -1, rejectClearance };

        axios
            .patch(`${host}/process`, data)
            .then((res) => {
                navigate("/");
            })
            .catch((err) => {
                console.dir(err);
                return setError("Cannot reject clearance, an error occured.");
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
            <DownloadCard id={process.fInsurance} name={desc.insuranceTitle} />
            <DownloadCard
                id={process.fDeclaration}
                name={desc.declarationTitle}
            />

            {error && (
                <Alert className="mt-4" variant="danger">
                    {error}
                </Alert>
            )}

            {accept ? (
                <>
                    <UploadCard
                        title={desc.clearanceTitle}
                        description={desc.clearanceDesc}
                        refFile={refPermit}
                    />
                    <Button
                        variant="success"
                        className="w-100 mt-3"
                        onClick={acceptRequest}
                    >
                        Accept Clearance Request
                    </Button>
                    <Button
                        variant="danger"
                        className="w-100 mt-3"
                        onClick={() => setAccept(false)}
                    >
                        Reject Clearance Request
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
                        Reject Clearance Request
                    </Button>
                    <Button
                        variant="success"
                        className="w-100 mt-3"
                        onClick={() => setAccept(true)}
                    >
                        Accept Clearance Request
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
