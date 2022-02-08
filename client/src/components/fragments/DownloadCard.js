import React from "react";
import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import { FileEarmarkText, Download, Folder2Open } from "react-bootstrap-icons";
import { useAuth } from "../../contexts/AuthContext";
import host from "../../host";

function DownloadCard({ id, name }) {
    const auth = useAuth();
    return (
        <Card className="border-0 shadow d-flex flex-row justify-content-between p-3 mt-3">
            <span className="display-6 fs-4">
                <FileEarmarkText size={35} /> {name}
            </span>

            <div>
                <a
                    className="btn btn-warning stretched-link"
                    href={`${host}/file/${name}?id=${id}&token=${auth.get.token}`}
                    target="_blank"
                >
                    <Folder2Open size={20} className="me-2" />
                    Open
                </a>
                <a
                    className="btn btn-warning mx-2"
                    href={`${host}/download?id=${id}&token=${auth.get.token}&name=${name}`}
                    style={{ position: "relative", zIndex: "99" }}
                >
                    <Download size={20} className="me-2" />
                    Download
                </a>
            </div>
        </Card>
    );
}

DownloadCard.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
};

export default DownloadCard;
