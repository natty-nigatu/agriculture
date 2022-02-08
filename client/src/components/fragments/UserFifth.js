import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../../contexts/AuthContext";
import { Container, Spinner, Button } from "react-bootstrap";
import axios from "axios";
import host from "../../host";
import desc from "../../descriptions";
import DownloadCard from "./DownloadCard";
import { useNavigate } from "react-router-dom";

function UserFifth({ id }) {
    const auth = useAuth();
    const [process, setProcess] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

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

    return isLoading ? (
        <div className="w-100 text-center mt-5">
            <Spinner animation="grow" variant="warning" />
        </div>
    ) : (
        <Container className="px-5" style={{ maxWidth: "1100px" }}>
            <h1 className="display-6 fs-1 mt-4">
                Process has been completed successfully.
            </h1>

            <div className="fs-5 mt-3">
                Your import clearance document is ready and can be seen on or
                downloaded from the card below.
                {process.status !== 0 &&
                    "You can also close the process to remove it from ongoing processes."}
            </div>
            <DownloadCard id={process.fClearance} name={desc.clearanceTitle} />

            {process.status !== 0 && (
                <Button
                    variant="warning"
                    className="w-100 mt-3"
                    onClick={closeProcess}
                >
                    Close Process
                </Button>
            )}
            <div className="fs-5 mt-5">
                All other files associated with this process and can be seen on
                or downloaded from the cards below.
            </div>
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
            <DownloadCard id={process.fPermit} name={desc.permitTitle} />
        </Container>
    );
}

UserFifth.propTypes = {
    id: PropTypes.string.isRequired,
};
export default UserFifth;
