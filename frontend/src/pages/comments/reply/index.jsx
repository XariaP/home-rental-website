import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../../../contexts";
import { useParams } from "react-router-dom";

// Display a particular reply
export default function ReplyCard({reply, refresh}) {
    const { token } = useContext(UserContext);  // Log in token of the current user
    const { propertyID } = useParams();         // Get property ID from the url
    const [pic, setPic] = useState(null);       // Get profile picture of the user who replied
    const uID = reply.written_by;               // ID of the user who wrote the reply
    const author = reply.posted_by;             // Name of the user who wrote the reply
    const content = reply.content;              // Text content of the reply
    const date = reply.date;                    // The date the reply was written
    const [ owner, setOwner ] = useState(null); // The property owner/host

    // Get information about property
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
            setOwner(data.host);
        })
    }

    // Display the profile picture of the commenter
    async function getPhoto(){
        fetch(`http://localhost:8000/accounts/profile/${uID}/view/host/`,
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
            setPic(data.avatar);
        })
    }
    
    // Run when page loads to initialize variablea
    useEffect(() => {
        getPhoto();
        getProperty();
    })

    // Return date the reply was posted
    const getdate = () => {
        return date.substring(0, 10);
    }

    // Display label to distinguish replies by the property owner
    const label = () => {
        if (owner == uID)
            return <>
                <span className="label label-success">Host</span> <span className="action-icons"></span>
            </>;

    }
    
    // Display reply
    return <>
        <div className="d-flex flex-row comment-row comment-reply">
            <div className="p-2"><span className="round"><img src={pic} alt="user" width="50"/></span></div>
            <div className="comment-text w-100">
                <h5>{author}</h5>
                <span className="date justify-content-between">{getdate()} </span>
                {label()}
                <div className="comment-footer"></div>
                <p className="msg">{content}</p>
            </div>
        </div>
    </>;
}