import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../../../contexts";
import { Link, useParams } from "react-router-dom";

// import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js";

export default function CommentBox({type, refresh}) {
    const { token } = useContext(UserContext);
    const { userID, propertyID } = useParams();
    const [ new_content, setNew_Content ] = useState("");
    const [ new_rate, setNew_Rate ] = useState(0);
    const [name, setName] = useState("");
    const [pname, setPname] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");

    const [host, setHost] = useState(null);
    const [myID, setMyID] = useState(null);

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
        else{
            getProperty();
            viewUser();
        }
    },[])

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
            // console.log(code);
            // console.log(data);

            var msg;
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
            else if (code == 200)
                msg = data;
            else if (code == 400)
                msg = data.content;
            else if (code == 403){
                if (type == "user"){
                    msg = "This user has no completed stays at your rentals!";
                }
                else {
                    msg = "You have no completed or terminated reservations at this property!";
                }
            }
            // console.log(msg);
            document.getElementById("status").innerHTML = msg;
        })
    }

    const handleSubmit = () => {
        // console.log(new_content, new_rate);
        // console.log(document.getElementById("star1").checked);
        postComment({
            content: new_content,
            rating: new_rate,
        });
    }

    const pageLink = () => {
        if (type === "user")
            return `http://localhost:3000/accounts/profile/${userID}/view/renter`;
        else
            return `http://localhost:3000/properties/${propertyID}/details`;
    }
    
    const getName = () => {
        if (type === "user")
            setName(fname + " " + lname);
        else
            setName(pname);
    }

    useEffect(() => {
        getName();
    })

    // const countWords = (e) => {
    //     document.getElementById('count').innerHTML = "Characters left: " + (500 - e.target.value.length);
    // }

    const handleChange = (e) => {
        document.getElementById("status").innerHTML = "";
        setNew_Content(e.target.value);
    }

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

                        {/* <textarea id="textarea" className="form-control" onChange={(e) => handleChange(e)} onKeyUp={e => countWords(e)} />  */}
                        <textarea id="textarea" className="form-control" onChange={(e) => handleChange(e)} /> 
                        <div className="mt-3 d-flex justify-content-between align-items-center"> 
                            {/* <span id="count"></span>  */}
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
    
    // return <>
    //     <div className="commentPage container mt-50 mb-100 d-flex justify-content-center align-items-center"> 
    //         <div className="card p-3"> 
    //             {getTitle()}
    //             <div className="rate">
    //                 <input type="radio" id="star5" name="rate" value="5" onClick={(e) => setNew_Rate(e.target.value)}/>
    //                 <label htmlFor="star5" title="text">5 stars</label>
    //                 <input type="radio" id="star4" name="rate" value="4" onClick={(e) => setNew_Rate(e.target.value)}/>
    //                 <label htmlFor="star4" title="text">4 stars</label>
    //                 <input type="radio" id="star3" name="rate" value="3" onClick={(e) => setNew_Rate(e.target.value)}/>
    //                 <label htmlFor="star3" title="text">3 stars</label>
    //                 <input type="radio" id="star2" name="rate" value="2" onClick={(e) => setNew_Rate(e.target.value)}/>
    //                 <label htmlFor="star2" title="text">2 stars</label>
    //                 <input type="radio" id="star1" name="rate" value="1" onClick={(e) => setNew_Rate(e.target.value)}/>
    //                 <label htmlFor="star1" title="text">1 star</label>
    //             </div>

    //             {/* <textarea id="textarea" className="form-control" onChange={(e) => handleChange(e)} onKeyUp={e => countWords(e)} />  */}
    //             <textarea id="textarea" className="form-control" onChange={(e) => handleChange(e)} /> 
    //             <div className="mt-3 d-flex justify-content-between align-items-center"> 
    //                 {/* <span id="count"></span>  */}
    //                 <span className="error" id="status"></span> 
    //                 <button className="btn btn-sm btn-success" onClick={handleSubmit}>Post</button> 
    //             </div> 
    //         </div>
    //     </div>
    // </>;
    
}