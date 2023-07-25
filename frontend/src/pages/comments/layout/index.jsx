import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../../../contexts";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../style.css"
import Pagination from "../../../components/pagination";

// Displays all comments associated with a certain renter/property
export default function CommentPage({type, content, page, link, total}) {
    const { token } = useContext(UserContext);      // Log in token of the current user
    const { userID, propertyID } = useParams();     // ID of the user or property which the comments are about
    const [fname, setFname] = useState();           // First name of the user the comments are about
    const [lname, setLname] = useState();           // Last name of the user the comments are about
    const [pname, setPname] = useState();           // Name of the property the comments are about
    const [host, setHost] = useState(null);         // Host of the property the comments are about
    const [myID, setMyID] = useState(null);         // ID of the currently logged in user

    // Page navigation
    const navigate = useNavigate();

    // Retrieves information about the user that the comments are about
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
            setFname(data.first_name);
            setLname(data.last_name);
        })
    }

    // Retrieve information about the property that the comments are about
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

    // Retrieve information about the user currently logged in
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

    // Retrieve information about users and property once the page loads
    useEffect(() => {
        if (type === "user")
            getUser();
        else {
            getProperty();
            viewUser();
        }
    },[])
    
    // Return url to the page of the user or property the comments are about
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

    // Return full name of the user or property as a string
    const getName = () => {
        if (type === "user")
            return fname + " " + lname;
        else
            return pname;
    }

    // Displays the full layout of the comment board
    return <>
        <button
            className="btn text-bg-primary"
            onClick={() => navigate(-1)} style={{position:"fixed", marginLeft:"5px", zIndex:"100"}}>
            Go Back
        </button>
        
        <div className="commentPage container d-flex justify-content-center mt-50 mb-50">
        
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Comments about <Link to={link2()}>{getName()}</Link></h4>
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
