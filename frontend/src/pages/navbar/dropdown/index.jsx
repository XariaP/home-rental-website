import React from "react";
import { Link } from "react-router-dom";

// Display dropdown menu for navigation bar
function NavBarDropDown({ icon, name, selected, onClick }) {
    // Return classNames for element
    const getClass = () => {
        var classes = "nav-link dropdown-toggle";
        if (selected){
            classes += " selected";
        }
        return classes;
    }

    // Calls a function which redirects to the appropriate link when clicked
    function handleClick(){
        onClick();
        // document.getElementById("dropdownMenu1").setAttribute("aria-expanded", "false");
        // document.getElementById("dropdownMenu2").removeAttribute("data-popper-placement");
        // document.getElementById("dropdownMenu2").classList.remove("show");
    }

    // Display action buttons for the dropdown menu
    function getActions(){
        if (name === "Profile"){ // User logged in
            return <>
                <li><Link className="dropdown-item" to="/accounts/myprofile/view" onClick={handleClick}>Visit Profile</Link></li>
                <li><Link className="dropdown-item" to="/accounts/myprofile/edit" onClick={handleClick}>Settings</Link></li>
                <li><Link className="dropdown-item" to="/accounts/logout" onClick={handleClick}>Log Out</Link></li>
            </>;
        }
        else if (name === "Guest"){ // User not logged in
            return <>
                <li><Link className="dropdown-item" to="/accounts/login" onClick={handleClick}>Log In</Link></li>
                <li><Link className="dropdown-item" to="/accounts/signup" onClick={handleClick}>Sign Up</Link></li>
            </>;
        }
    }

    // Display dropdown
    return <>
        <li className="nav-item dropdown">
            <a type="button" className={getClass()} data-bs-toggle="dropdown" aria-expanded="false" id="dropdownMenu1">
                <img className="bi d-block mx-auto mb-1" src={ icon } />
                { name }
            </a>
            <ul className="dropdown-menu dropdown-menu-dark" id="dropdownMenu2">
                {getActions()}
            </ul>
        </li>
    </>;
}

export default NavBarDropDown;