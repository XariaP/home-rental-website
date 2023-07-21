import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../../../contexts";
import { Link, useParams } from "react-router-dom";

// import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js";

export default function ReplyBox({commentID, refresh}) {
    const { token } = useContext(UserContext);
    const { propertyID } = useParams();
    const [ new_content, setNew_Content ] = useState("");
    
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
            if (code == 201){
                msg = "Comment posted!";
                document.getElementById(textboxID).value = "";
                setNew_Content("");
                refresh();

            }
            else if (code == 200)
                msg = data;
            else if (code == 400)
                msg = data.content;
            else if (code == 403){
                msg = msg = "You are not allowed to reply this comment.";
            }
                
            document.getElementById(errorID).innerHTML = msg;
        })
    }

    const handleSubmit = () => {
        postComment({
            content: new_content,
        });
    }

    const handleChange = (e) => {
        document.getElementById(errorID).innerHTML = "";
        setNew_Content(e.target.value);
    }

    const textboxID = "replyarea" + commentID;
    const errorID = "errors" + commentID;
    
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