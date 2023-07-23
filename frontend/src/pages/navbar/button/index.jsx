import React from "react";
import { Link } from "react-router-dom";

// Create button for navigation bar
function NavBarButton({ link, icon, name, selected, onClick }) {
    // Return classNames for button
    const getClass = () => {
        var classes = "nav-link";
        if (selected){
            classes += " selected";
        }
        return classes;
    }

    // Return button with associated text, link, and function
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