import React, {useState} from "react";
import { Link } from "react-router-dom";

function SiteLogo({ homeLink, icon, sitename, onClick }) {
    return <>
        <Link to={ homeLink } className="d-flex align-items-center my-2 my-lg-0 me-lg-auto text-white text-decoration-none" onClick={onClick}>
            <img src={ icon } width="100px" />
            <p className="logo"> { sitename } </p>
        </Link>
    </>;
}

export default SiteLogo;