import React, { useEffect, useContext, useState } from "react";
import "../style.css";
import { PageContext, UserContext } from "../../../../../contexts";
import { Link } from "react-router-dom";

function ViewMyProfile(props) {
    const { token } = useContext(UserContext);
    const { setPage } = useContext(PageContext);
    const [pic, setPic] = useState(null);
    const [fname, setFname] = useState();
    const [lname, setLname] = useState();
    const [email, setEmail] = useState();
    const [phonenum, setPhonenum] = useState();

    const [msg, setMsg] = useState(null);

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
            // console.log(data);
            setPic(data.avatar);
            setFname(data.first_name);
            setLname(data.last_name);
            setEmail(data.email)
            setPhonenum(data.phone_number);

            if (code == 401){
                setMsg("You are not logged in");
            }
        })
    }

    useEffect(() => {
        viewInfo();
        setPage("profile");
    }, [])

    const email_link = "mailto:" + email;

    const type = () => {
        return "You";
    }

    const getPhoneNum = () => {
        if (phonenum)
            return " / " + phonenum;
    }

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