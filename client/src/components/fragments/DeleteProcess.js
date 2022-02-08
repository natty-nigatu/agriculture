import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import PropTypes from "prop-types";
import axios from "axios";
import host from "../../host";
import {Trash} from "react-bootstrap-icons"

function DeleteProcess({ id, callback }) {
    const auth = useAuth();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function handleDelete() {
        const token = auth.get.token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const user = auth.get.id;

        axios
            .delete(`${host}/process`, { data: { user, id } })
            .then((res) => {
                if (res.status === 200) {
                    handleClose();
                    callback();
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <>
            <Link
                to=""
                className="btn btn-danger float-end ms-2"
                style={{ position: "relative", zIndex: "99" }}
                onClick={handleShow}
            >
                <Trash size={20} className="me-1" />
                Delete
            </Link>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Process?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    This action is irreversible. Are you sure you want to delete
                    this processs?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

DeleteProcess.propTypes = {
    id: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired,
};

export default DeleteProcess;
