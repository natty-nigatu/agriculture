import axios from "axios";
import React, { useRef, useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import desc from "../../descriptions";
import UploadCard from "./UploadCard";
import { useAuth } from "../../contexts/AuthContext";
import host from "../../host";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function UserFirst({ id }) {
    const refLicense = useRef();
    const refMoa = useRef();
    const refPre = useRef();
    const refProforma = useRef();
    const refApproval = useRef();

    const auth = useAuth();
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        const license = refLicense.current.files[0];
        const moa = refMoa.current.files[0];
        const pre = refPre.current.files[0];
        const proforma = refProforma.current.files[0];
        const approval = refApproval.current.files[0];

        const cant =
            " is needed to request a permit. Please fill all required fields.";
        if (license === undefined) return setError(desc.licenseTitle + cant);
        if (moa === undefined) return setError(desc.moaTitle + cant);
        if (proforma === undefined) return setError(desc.proformaTitle + cant);
        if (approval === undefined) return setError(desc.approvalTitle + cant);

        const token = auth.get.token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const fileIds = { id, step: 2, status: 1 };
        const data = new FormData();
        data.append("user", auth.get.id);
        data.append("file", license);

        axios
            .put(`${host}/file`, data)
            .then((res) => {
                fileIds.fLicense = res.data.id;

                data.delete("file");
                data.append("file", moa);
                return axios.put(`${host}/file`, data);
            })
            .then((res) => {
                fileIds.fMoa = res.data.id;

                data.delete("file");
                data.append("file", proforma);
                return axios.put(`${host}/file`, data);
            })
            .then((res) => {
                fileIds.fProforma = res.data.id;

                data.delete("file");
                data.append("file", approval);
                return axios.put(`${host}/file`, data);
            })
            .then((res) => {
                fileIds.fApproval = res.data.id;

                if (pre !== undefined) {
                    data.delete("file");
                    data.append("file", pre);
                    return axios.put(`${host}/file`, data);
                } else {
                    axios.patch(`${host}/process`, fileIds);
                    return navigate(0);
                }
            })
            .then((res) => {
                fileIds.fPre = res.data.id;

                axios.patch(`${host}/process`, fileIds);
                return navigate(0);
            })
            .catch((err) => {
                if (err.name !== "TypeError" && pre === undefined) {
                    console.dir(err);
                    return setError("Cannot request permit, an error occured.");
                }
            });
    }

    return (
        <Container className="px-5" style={{ maxWidth: "1100px" }}>
            <div>
                {error && (
                    <Alert className="mt-4" variant="danger">
                        {error}
                    </Alert>
                )}
                <Form>
                    <UploadCard
                        title={desc.licenseTitle}
                        description={desc.licenseDesc}
                        refFile={refLicense}
                    />
                    <UploadCard
                        title={desc.moaTitle}
                        description={desc.moaDesc}
                        refFile={refMoa}
                    />
                    <UploadCard
                        title={desc.preShipmentTitle}
                        description={desc.preShipmentDesc}
                        refFile={refPre}
                    />
                    <UploadCard
                        title={desc.proformaTitle}
                        description={desc.proformaDesc}
                        refFile={refProforma}
                    />

                    <UploadCard
                        title={desc.approvalTitle}
                        description={desc.approvalDesc}
                        refFile={refApproval}
                    />
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Button
                        className="mb-4 w-100"
                        variant="warning"
                        type="submit"
                        onClick={handleSubmit}
                    >
                        Request Permit
                    </Button>
                </Form>
            </div>
        </Container>
    );
}

UserFirst.propTypes = {
    id: PropTypes.string.isRequired,
};

export default UserFirst;
