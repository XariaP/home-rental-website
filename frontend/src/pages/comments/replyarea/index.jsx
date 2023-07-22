import React, { useContext, useState } from "react";
import { UserContext } from "../../../contexts";
import { useParams } from "react-router-dom";

// Display the textbox to leave a reply to a comment
export default function ReplyBox({commentID, refresh}) {
    const { token } = useContext(UserContext);              // Log in token of the current user
    const { propertyID } = useParams();                     // ID of property which the comment will be about
    const [ new_content, setNew_Content ] = useState("");   // Text to be posted
    
    // Send data to the backend to create a new reply
    async function postComment(data){
        var code;

        fetch(`http://localhost:8000/comments/property/${propertyID}/reply/${commentID}/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization' : `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            })
        .then((response) => {
            code = response.status;
            return response.json();
        })
        .then((data) => {
            var msg;
            // Comment successfully created, clear inputs
            if (code == 201){
                msg = "Comment posted!";
                document.getElementById(textboxID).value = "";
                setNew_Content("");
                refresh();

            }
            // Request ok but comment not created
            else if (code == 200)
                msg = data;
            // Bad Request, comment can't be posted
            else if (code == 400)
                msg = data.content;
            // Forbidden error
            else if (code == 403){
                msg = msg = "You are not allowed to reply this comment.";
            }
            // Set error message to be displayed if any
            document.getElementById(errorID).innerHTML = msg;
        })
    }

    // Function to handle data submission to create new reply
    const handleSubmit = () => {
        postComment({
            content: new_content,
        });
    }

    // Update text each time the user types
    const handleChange = (e) => {
        document.getElementById(errorID).innerHTML = "";
        setNew_Content(e.target.value);
    }

    // IDs for textbox and error elements
    const textboxID = "replyarea" + commentID;
    const errorID = "errors" + commentID;
    
    // Display reply box for input
    return <>
        <div className="container mb-10 mt-10 d-flex justify-content-center align-items-center"> 
            <div className="card p-3"> 
                <h5>Add reply</h5> 
                <textarea id={textboxID} className="form-control" onChange={(e) => handleChange(e)} />  
                <div className="mt-3 d-flex justify-content-between align-items-center"> 
                    <span className="error" id={errorID}></span> 
                    <button className="btn btn-sm btn-success" onClick={handleSubmit}>Post</button> 
                </div> 
            </div>
        </div>
    </>;
}