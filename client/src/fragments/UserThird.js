import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Container, Form, Spinner } from "react-bootstrap";
import desc from "../../descriptions";
import UploadCard from "./UploadCard";
import { useAuth } from "../../contexts/AuthContext";
import host from "../../host";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import DownloadCard from "./DownloadCard";

function UserThird({ id, reupload }) {
    const refInsurance = useRef();
    const refDeclaration = useRef();

    const auth = useAuth();
    const [error, setError] = useState(null);
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

    function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        const insurance = refInsurance.current.files[0];
        const declaration = refDeclaration.current.files[0];

        const cant =
            " is needed to request a permit. Please fill all required fields.";
        if (insurance === undefined)
            return setError(desc.insuranceTitle + cant);
        if (declaration === undefined)
            return setError(desc.declarationTitle + cant);

        const token = auth.get.token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const fileIds = { id, step: 4, status: 1 };
        const data = new FormData();
        data.append("user", auth.get.id);
        data.append("file", insurance);

        axios
            .put(`${host}/file`, data)
            .then((res) => {
                fileIds.fInsurance = res.data.id;

                data.delete("file");
                data.append("file", declaration);
                return axios.put(`${host}/file`, data);
            })
            .then((res) => {
                fileIds.fDeclaration = res.data.id;

                axios.patch(`${host}/process`, fileIds);
                return navigate(0);
            })
            .catch((err) => {
                console.dir(err);
                return setError("Cannot request clearance, an error occured.");
            });
    }

    return isLoading ? (
        <div className="w-100 text-center mt-5">
            <Spinner animation="grow" variant="warning" />
        </div>
    ) : (
        <Container className="px-5" style={{ maxWidth: "1100px" }}>
            {!reupload && (
                <>
                    <DownloadCard
                        id={process.fPermit}
                        name={desc.permitTitle}
                    />
                    <div className="fs-6 mt-3">
                        Your import permit is ready and can be seen on or
                        downloaded from the card above.
                    </div>
                </>
            )}
            <div>
                {error && (
                    <Alert className="mt-4" variant="danger">
                        {error}
                    </Alert>
                )}
                <Form>
                    <UploadCard
                        title={desc.insuranceTitle}
                        description={desc.insuranceDesc}
                        refFile={refInsurance}
                    />
                    <UploadCard
                        title={desc.declarationTitle}
                        description={desc.declarationDesc}
                        refFile={refDeclaration}
                    />

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Button
                        className="mb-4 w-100"
                        variant="warning"
                        type="submit"
                        onClick={handleSubmit}
                    >
                        Request Clearance
                    </Button>
                </Form>
            </div>
        </Container>
    );
}

UserThird.propTypes = {
    id: PropTypes.string.isRequired,
    reupload: PropTypes.bool.isRequired,
};

export default UserThird;
