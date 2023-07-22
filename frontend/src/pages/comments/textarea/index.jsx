import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../../../contexts";
import { Link, useParams } from "react-router-dom";

// Display the textbox to leave a comment
export default function CommentBox({type, refresh}) {
    const { token } = useContext(UserContext);              // Log in token of the current user
    const { userID, propertyID } = useParams();             // ID of the user or property which the comment will be about
    const [ new_content, setNew_Content ] = useState("");   // Text to be posted
    const [ new_rate, setNew_Rate ] = useState(0);          // Rating to be given
    const [pname, setPname] = useState("");                 // Name of the property which the comment will be about
    const [fname, setFname] = useState("");                 // First name of the user which the comment will be about
    const [lname, setLname] = useState("");                 // Last name of the user which the comment will be about
    const [name, setName] = useState("");                   // Full name of property/user to be displayed

    const [host, setHost] = useState(null);                 // Host of the property which the comment will be about
    const [myID, setMyID] = useState(null);                 // ID of the currently logged in user who will be posting the comment

    // Retrieve information about the user the comment will be about
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

    // Retrieve information about the property the comment will be about
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
        else{
            getProperty();
            viewUser();
        }
    },[])

    // Send data to the backend to create a new comment
    async function postComment(data){
        var code;
        var url;

        if (type == "user"){
            url = `http://localhost:8000/comments/user/${userID}/add/`;
        }
        else if (type == "property"){
            url = `http://localhost:8000/comments/property/${propertyID}/add/`
        }
        
        fetch(url,
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
                document.getElementById("textarea").value = "";
                document.getElementById("star1").checked = false;
                document.getElementById("star2").checked = false;
                document.getElementById("star3").checked = false;
                document.getElementById("star4").checked = false;
                document.getElementById("star5").checked = false;
                setNew_Content("");
                setNew_Rate(0);
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
                if (type == "user"){
                    msg = "This user has no completed stays at your rentals!";
                }
                else {
                    msg = "You have no completed or terminated reservations at this property!";
                }
            }
            // Set error message to be displayed if any
            document.getElementById("status").innerHTML = msg;
        })
    }

    // Function to handle data submission to create new comment
    const handleSubmit = () => {
        postComment({
            content: new_content,
            rating: new_rate,
        });
    }

    // Return link of user or property the comment is about
    const pageLink = () => {
        if (type === "user")
            return `http://localhost:3000/accounts/profile/${userID}/view/renter`;
        else
            return `http://localhost:3000/properties/${propertyID}/details`;
    }
    
    // Get name of user or property the comment is about
    const getName = () => {
        if (type === "user")
            setName(fname + " " + lname);
        else
            setName(pname);
    }

    // Get name once page loads
    useEffect(() => {
        getName();
    })

    // Update text each time the user types
    const handleChange = (e) => {
        document.getElementById("status").innerHTML = "";
        setNew_Content(e.target.value);
    }

    // Returns question to prompt the user to write a comment
    const getTitle = () => {
        if (type == "user"){
            return <>
                <h5>How was your experience with <Link to={pageLink()}> {name}</Link> ?</h5>
            </>;
        }
        else {
            return <>
                <h5>How was your stay at <Link to={pageLink()}> {name}</Link> ?</h5>
            </>;
        }
    }

    // Display textbox and input fields to page
    const getContent = () => {
        if ( type === "user" || (host && myID && host != myID))
            return <>
                <div className="commentPage container mt-50 mb-100 d-flex justify-content-center align-items-center"> 
                    <div className="card p-3"> 
                        {getTitle()}
                        <div className="rate">
                            <input type="radio" id="star5" name="rate" value="5" onClick={(e) => setNew_Rate(e.target.value)}/>
                            <label htmlFor="star5" title="text">5 stars</label>
                            <input type="radio" id="star4" name="rate" value="4" onClick={(e) => setNew_Rate(e.target.value)}/>
                            <label htmlFor="star4" title="text">4 stars</label>
                            <input type="radio" id="star3" name="rate" value="3" onClick={(e) => setNew_Rate(e.target.value)}/>
                            <label htmlFor="star3" title="text">3 stars</label>
                            <input type="radio" id="star2" name="rate" value="2" onClick={(e) => setNew_Rate(e.target.value)}/>
                            <label htmlFor="star2" title="text">2 stars</label>
                            <input type="radio" id="star1" name="rate" value="1" onClick={(e) => setNew_Rate(e.target.value)}/>
                            <label htmlFor="star1" title="text">1 star</label>
                        </div>

                        <textarea id="textarea" className="form-control" onChange={(e) => handleChange(e)} /> 
                        <div className="mt-3 d-flex justify-content-between align-items-center"> 
                            <span className="error" id="status"></span> 
                            <button className="btn btn-sm btn-success" onClick={handleSubmit}>Post</button> 
                        </div> 
                    </div>
                </div>
            </>;
        else
            return <div className="mb-5"></div>;
    }

    return <>
        {getContent()}
    </>;    
}