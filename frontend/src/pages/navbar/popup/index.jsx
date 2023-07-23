import React from "react";

// Display popup for notifications on navigation bar
function NavBarPopUp({ icon, name, selected, num_notices }) {
    return <>
        <li>
            <a href="" className="nav-link btn position-relative" type="button" data-bs-toggle="modal" data-bs-target="#notiModal">
            <img className="bi d-block mx-auto mb-1" src={ icon } />
            { name }
            <span className="position-absolute corner-badge translate-middle badge rounded-pill bg-danger">
                { num_notices }
            </span>
            </a>
        </li>
    </>;
}

export default NavBarPopUp;