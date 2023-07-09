import React, { useEffect, useContext, useState } from "react";
import "../style.css";
import icons from '../../../../../components/icons';
import { UserContext } from "../../../../../contexts";
import { Link, useParams, useNavigate } from "react-router-dom";

function ViewProfile(props) {
    const { token } = useContext(UserContext);
    const [pic, setPic] = useState(null);
    const [fname, setFname] = useState();
    const [lname, setLname] = useState();
    const [email, setEmail] = useState();
    const [phonenum, setPhonenum] = useState();

    const [msg, setMsg] = useState("Not logged in");

    const { userID, userType } = useParams();

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
            //console.log(token);
            return request.json();
        })
        .then((data) => {
            //console.log(data);
            if (data.detail){
                setMsg(data.detail);
                if (code == 401){
                    setMsg("You are not logged in");
                }
            }
            else {
                setMsg(null);
            }

            setPic(data.avatar);
            setFname(data.first_name);
            setLname(data.last_name);
            setEmail(data.email);
            setPhonenum(data.phone_number);  
        })
    }

    useEffect(() => {
        viewInfo();
    }, [])

    const email_link = "mailto:" + email;

    const type = () => {
        return userType.charAt(0).toUpperCase() + userType.slice(1);
    }
    
    const getPhoneNum = () => {
        if (phonenum)
            return " / " + phonenum;
    }

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

    const show_content = (msg) => {
        if (msg)
            return forbidden(msg);
        else
            return allowed();
    }

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

    const forHost = () => {
        return <> </>;
    }

    const show_actions = () => {
        if (userType === "renter")
            return forRenter();
        else if (userType === "host")
            return forHost();
    }

    const navigate = useNavigate();
    

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