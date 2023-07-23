import React, { useEffect, useContext, useState } from "react";
import "../style.css";
import icons from '../../../../../components/icons';
import { UserContext } from "../../../../../contexts";
import { Link, useParams, useNavigate } from "react-router-dom";

// Displays the profile of another user
function ViewProfile(props) {
    const { token } = useContext(UserContext);          // Stores token for current user session
    const [pic, setPic] = useState(null);
    const [fname, setFname] = useState();
    const [lname, setLname] = useState();
    const [email, setEmail] = useState();
    const [phonenum, setPhonenum] = useState();
    const [msg, setMsg] = useState("Not logged in");    // Stores confirmation or error messages to be displayed

    const { userID, userType } = useParams();           // Stores the ID and type of the user the profile belongs to

    // Retrieve user's information to fill page contents
    async function viewInfo(){
        var is_valid;
        var code;
        fetch(`http://localhost:8000/accounts/profile/${userID}/view/${userType}/`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization' : `Bearer ${token}`,
                },
            })
        .then((request) => {
            is_valid = request.ok;
            code = request.status;
            return request.json();
        })
        .then((data) => {
            // Display error messages if any
            if (data.detail){
                setMsg(data.detail);
                if (code == 401){
                    setMsg("You are not logged in");
                }
            }
            else {
                setMsg(null);
            }

            // Collect user information
            setPic(data.avatar);
            setFname(data.first_name);
            setLname(data.last_name);
            setEmail(data.email);
            setPhonenum(data.phone_number);  
        })
    }

    // Display user information as soon as page loads
    useEffect(() => {
        viewInfo();
    }, [])

    // Initialize link to send an email directly to the user
    const email_link = "mailto:" + email;

    // Specifies the user type of the profile being displayed ("Renter", "Host", "You")
    const type = () => {
        return userType.charAt(0).toUpperCase() + userType.slice(1);
    }
    
    // Return the phone number of the user
    const getPhoneNum = () => {
        if (phonenum)
            return " / " + phonenum;
    }

    // Display error message if any, e.g. User not allowed to view the profile of this user
    const forbidden = (msg) => {
        return <>
            <div className="row py-5 px-5">
                <div className="mx-auto">
                    <img className="mb-4" src={icons["logo"]} alt="" height="90" />
                    <h3 className="fw-light">{msg}</h3>
                </div>
            </div>
        </>;
    }

    // Allow navigation between pages
    const navigate = useNavigate();
    
    // Display profile if user is allowed to view it
    const allowed = () => {
        var stars = "";

        if (userType === "renter")
            stars = <p><span className="gold-star">★ ★ ★ ★ </span> <span className="grey-star">★ </span></p>;
        return <>
            <div className="py-4 p-2">
                <div>
                    <img src={pic} className="avatar" width="100" />
                    <span className="position-absolute translate-middle badge text-bg-dark title">{type()}</span>
                </div>

                <div className="mt-3 d-flex flex-row justify-content-center">
                    <h5>{fname} {lname}</h5>
                </div>

                {stars}
                
                <h6 className="mt-3">Contact me</h6>
                <span id="contact-info"><a href={email_link}>{email}</a> {getPhoneNum()} </span>
            </div>
            
            {show_actions()}

            <button
                className="btn btn-info icon-left"
                onClick={() => navigate(-1)}>
                Back
            </button>
        </>;
    }

    // Determine the output to display to the current user
    const show_content = (msg) => {
        if (msg)
            return forbidden(msg);
        else
            return allowed();
    }

    // Displays link to comment board for a renter's profile
    const forRenter = () => {
        const link = "/comments/user/" + userID + "/view";
        return <>
            <div>
                <ul className="list-unstyled list">
                    <Link className="comment" to={link}>
                        <li>
                            <span className="font-weight-bold">Read comments from other hosts</span>
                        </li>
                    </Link>
                </ul>
            </div>
        </>;
    }

    // Host profiles do not have comment boards
    const forHost = () => {
        return <> </>;
    }

    // Show action buttons depending on the user type of the profile
    const show_actions = () => {
        if (userType === "renter")
            return forRenter();
        else if (userType === "host")
            return forHost();
    }

    // Display profile layout
    return <>
        <main className="profile content">
            <div className="container height-100 d-flex justify-content-center align-items-center mt-4 mb-4">
                <div className="card text-center">
                    {show_content(msg)}
                </div>
            </div>
        </main>
    </>;
}

export default ViewProfile;