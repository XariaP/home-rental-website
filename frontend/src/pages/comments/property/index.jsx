import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../../../contexts";
import { useParams } from "react-router-dom";
import CommentCard from "../comment";
import CommentBox from "../textarea";
import CommentPage from "../layout";
import icons from '../../../components/icons';

// Return comments about a property
export default function PropertyComment(props) {
    const { token } = useContext(UserContext);              // Log in token of the current user
    const { propertyID, pageNum } = useParams();            // Get property ID and page number from the url
    const [ commentList, setCommentList ] = useState(null); // List of comments in JSON format
    const [ comment, setComment ] = useState([]);           // List of comments stored as elements for displaying
    const [ total, setTotal ] = useState(1);                // Number of comments on this page
    const [ datacount, setDataCount ] = useState(0);        // Number of comments about this property
    const [msg, setMsg] = useState("");                     // Stores Error Message

    // Set default page to the first page or to the specified page number
    var pg = 1;
    if (pageNum)
        pg = pageNum;

    // Link to view property information
    const link = `/comments/property/${propertyID}/view/page/`;

    // Get all comments about this property on the specified page number
    async function getComments(){
        var is_valid;
        var code;
        fetch(`http://localhost:8000/comments/property/${propertyID}/view/?page=${pg}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization' : `Bearer ${token}`,
                },
            })
        .then((response) => {
            is_valid = response.ok;
            code = response.status;
            return response.json();
        })
        .then((data) => {
            if (is_valid){
                var total =  Math.ceil(data.count / 5);
                if (total == 0)
                    total = 1;
                setTotal(total);
                setDataCount(data.count);
                setCommentList(data.results);
            }
            else {
                if (code == 404){
                    setMsg("This page does not exist");
                }
                else if (code == 403){
                    setMsg("You are not permitted to view comments about this property");
                }
                else if (code == 401){
                    setMsg("You must log in before proceeding");
                }
            }
        })
    }

    // Load comments each time the current page changes
    useEffect(() => {
        getComments();
    }, [pg])

    // Update elements on display whenever the list of comments changes
    useEffect(() => {
        if (!commentList)
            setComment(<></>);
        else if (datacount == 0){
            setComment(<>
                <div style={{padding:20}}>No comments yet</div>
            </>);
        }
        else {
            setComment(<>
                {commentList.map(comment => (
                    <CommentCard key={comment.id} type="property" comment={comment} refresh={(handleRefresh)}/>
                ))}
            </>);
        }
    }, [commentList])

    // Wait for comments to load when page refreshed
    async function handleRefresh() {
        await getComments();
    }

    // Display message if current user is not allowed to view this comment page
    const forbidden = (msg) => {
        return <>
            <div className="container height-100 d-flex justify-content-center align-items-center mt-4 mb-4">
                <div className="card text-center">
                    <div className="row py-5 px-5">
                        <div className="mx-auto">
                            <img className="mb-4" src={icons["logo"]} alt="" height="90" />
                            <h3 className="fw-light">{msg}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </>;
    }

    // Display comment list if user is allowed to view
    const allowed = () => {
        return <>
            <CommentPage type="property" content={comment} page={pg} link={link} total={total}/>
            <CommentBox type="property" refresh={handleRefresh}/>
        </>;
    }

    // Show comment list if there is no error message
    const show_content = (err_msg) => {
        if (err_msg)
            return forbidden(err_msg);
        else
            return allowed();
    }
    
    return <>
        <main className="content">
            {show_content(msg)}
        </main>
    </>;
}