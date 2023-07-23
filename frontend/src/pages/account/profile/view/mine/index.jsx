import React, { useEffect, useContext, useState } from "react";
import "../style.css";
import { PageContext, UserContext } from "../../../../../contexts";
import { Link } from "react-router-dom";

// Displays the current user's own profile
function ViewMyProfile(props) {
    const { token } = useContext(UserContext);      // Stores token for current user session
    const { setPage } = useContext(PageContext);
    const [pic, setPic] = useState(null);
    const [fname, setFname] = useState();
    const [lname, setLname] = useState();
    const [email, setEmail] = useState();
    const [phonenum, setPhonenum] = useState();
    const [msg, setMsg] = useState(null);           // Stores confirmation or error messages to be displayed

    // Retrieve user's information to fill page contents
    async function viewInfo(){
        var is_valid;
        var code;
        fetch('http://localhost:8000/accounts/myprofile/view/',
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
            setPic(data.avatar);
            setFname(data.first_name);
            setLname(data.last_name);
            setEmail(data.email)
            setPhonenum(data.phone_number);
            
            // Set error message
            if (code == 401){
                setMsg("You are not logged in");
            }
        })
    }

    // Retrieve information as soon as the page is loaded
    useEffect(() => {
        viewInfo();
        setPage("profile");
    }, [])

    // Initialize link to send an email directly to the user
    const email_link = "mailto:" + email;

    // Specifies the user type of the profile being displayed ("You", "Renter", "Host")
    const type = () => {
        return "You";
    }

    // Return the phone number of the user
    const getPhoneNum = () => {
        if (phonenum)
            return " / " + phonenum;
    }

    // Display error message if any
    if (msg)
        return <>
            <main className="profile content">
                <div className="container height-100 d-flex justify-content-center align-items-center mt-4 mb-4">
                    <div className="card text-center">
                        <div className="row py-5 px-5">
                            <div className="mx-auto">
                                {/* <img className="mb-4" src={icons["logo"]} alt="" height="90" /> */}
                                <h3 className="fw-light">{msg}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>;
    
    // Display layout for user profile
    return <>
        <main className="profile content">
            <div className="container height-100 d-flex justify-content-center align-items-center mt-4 mb-4">
                <div className="card text-center">
                    <div className="py-4 p-2">
                        <div>
                            <img src={pic} className="avatar" width="100" />
                            <span className="position-absolute translate-middle badge text-bg-dark title">{type()}</span>
                        </div>

                        <div className="mt-3 d-flex flex-row justify-content-center">
                            <h5>{fname} {lname}</h5>
                        </div>
                        
                        <h6 className="mt-3">Contact me</h6>
                        <span id="contact-info"><a href={email_link}>{email}</a> {getPhoneNum()} </span>
                    </div>

                    <div>
                        <ul className="list-unstyled list">
                            <Link className="comment" to="/accounts/myprofile/edit">
                            {/* <Link className="comment" to="/accounts/profile/10/view/renter"> */}
                                <li>
                                    <span className="font-weight-bold">Edit Profile</span>
                                </li>
                            </Link>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    </>;
}

export default ViewMyProfile;