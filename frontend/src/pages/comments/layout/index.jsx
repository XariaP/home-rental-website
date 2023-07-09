import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../../../contexts";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../style.css"
import Pagination from "../../../components/pagination";
// import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js";

export default function CommentPage({type, content, page, link, total}) {
    const { token } = useContext(UserContext);
    const { userID, propertyID } = useParams();
    const [fname, setFname] = useState();
    const [lname, setLname] = useState();
    const [pname, setPname] = useState();
    // const [email, setEmail] = useState();

    const [host, setHost] = useState(null);
    const [myID, setMyID] = useState(null);

    const navigate = useNavigate();

    async function getUser(){
        fetch(`http://localhost:8000/accounts/profile/${userID}/view/renter/`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization' : `Bearer ${token}`,
                },
            })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            // console.log(data);
            // console.log(link);
            setFname(data.first_name);
            setLname(data.last_name);
            // setEmail(data.email);
        })
    }

    async function getProperty(){
        fetch(`http://localhost:8000/properties/${propertyID}/details/`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization' : `Bearer ${token}`,
                },
            })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            setPname(data.name);
            setHost(data.host);
        })
    }

    async function viewUser(){
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
            return request.json();
        })
        .then((data) => {
            setMyID(data.id);
        })
    }

    useEffect(() => {
        if (type === "user")
            getUser();
        else {
            getProperty();
            viewUser();
        }
    },[])
    
    const link2 = () => {
        if (type === "user")
            return "/accounts/profile/" + userID + "/view/renter";
        else {
            if (host == myID)
                return "/properties/" + propertyID + "/update";
            else
                return "/properties/" + propertyID + "/details";
        }
    }

    const getName = () => {
        if (type === "user")
            return fname + " " + lname;
        else
            return pname;
    }

    // if (type === "user" && (!fname || !lname || !content))
    //     return <></>;
    
    // if (type === "property" && (!content))
    //     return <></>;
    
    return <>

        <button
            className="btn text-bg-primary"
            onClick={() => navigate(-1)} style={{position:"fixed", marginLeft:"5px", zIndex:"100"}}>
            Go Back
        </button>
        
        <div className="commentPage container d-flex justify-content-center mt-50 mb-50">
        
            <div className="row">
                <div className="col-md-12">

                {/* <button
                    className="btn text-bg-primary"
                    onClick={() => navigate(-1)}>
                    Go Back
                </button> */}

                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Comments about <Link to={link2()}>{getName()}</Link></h4>
                            {/* <h6 className="card-subtitle">Be the first to comment</h6> */}
                        </div>

                        <div className="comment-widgets m-b-20">
                            {content}
                        </div>

                        <Pagination total={total} pg={page} link={link}/>

                    </div>
                </div>
            </div>
        </div>
    </>;
}