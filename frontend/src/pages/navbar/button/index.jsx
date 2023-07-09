import React, {useState} from "react";
import { Link } from "react-router-dom";

function NavBarButton({ link, icon, name, selected, onClick }) {
    const getClass = () => {
        var classes = "nav-link";
        if (selected){
            classes += " selected";
        }
        return classes;
    }

    return <>
        <li>
            <Link className={getClass()} to={link} onClick={onClick}>
                <img className="bi d-block mx-auto mb-1" src={icon} />
                { name }
            </Link>
        </li>
    </>;
}

export default NavBarButton;