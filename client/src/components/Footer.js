import React from "react";

function Footer() {
    return (
        <footer
            className="footer bg-light text-center p-2 fs-5"
            style={{ marginTop: "10rem", color: "gray" }}
        >
            {
            <div className="row">
                <div className="col-3"></div>
                <div className="col">
                    2022, Addis Ababa Science and Technology University
                </div>
            </div>
    }
        </footer>
    );
}

export default Footer;
