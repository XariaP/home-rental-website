import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../../../contexts";

import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js";
import ReplyCard from "../reply";
import ReplyBox from "../replyarea";

// Display a particular comment
export default function CommentCard({type, comment, refresh}) {
    const { token } = useContext(UserContext);  // Log in token of the current user
    const [pic, setPic] = useState(null);       // Profile photo of the commenter to be displayed
    const ID = comment.id;                      // ID of the comment to be displayed
    const uID = comment.written_by;             // ID of the user who wrote the comment
    const author = comment.posted_by;           // Name of the user who wrote the comment
    const stars = comment.rating;               // Star rating given by the commenter
    const content = comment.content;            // Text content of the comment
    const date = comment.date;                  // The date the comment was written
    const replies = comment.replies;            // List of comments made in reply to this comment

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
    })

    // Return the date the comment was posted
    const getdate = () => {
        return date.substring(0, 10);
    }

    // Display the star rating associated with the comment
    const countStars = () => {
        var goldstars = "";
        var nostar = "";
        var count = 0;
        while (count != stars){
            goldstars += '★ ';
            count++;
        }
        while (count != 5){
            nostar += '★ ';
            count++;
        }

        return <>
            <span className="gold-star">{goldstars}</span><span className="grey-star">{nostar}</span>
        </>;
    }

    // Return the appropriate element depending on how many replies the comment has.
    const replyNumber = () => {
        if (replies.length > 0)
            return <>
                <p className="text-primary">View Replies ({replies.length})</p>
            </>;
        else if (type === "property"){
            return <>
                <p className="text-primary">Leave a reply</p>
            </>;
        }
    }

    // Display the replies to the comment
    const printReplies = () => {
        if (replies.length > 0 || type == "property")
            return <>
                <div className="collapse" id={getReplyCtrl()}>
                    <div className="card card-body">
                        {replies.map(reply => {
                            return <ReplyCard key={reply.id} reply={reply}/>
                        })}
                    </div>
                    <ReplyBox commentID={ID} refresh={refresh}/>
                </div>
                
            </>;
    }

    // Return the ID of the comment's reply
    const getReplyID = () => {
        return "#reply" + ID;
    }
    const getReplyCtrl = () => {
        return "reply" + ID;
    }
    
    // Display the comment once the picture has loaded
    if (pic)
        return <>
        <div className="d-flex flex-row comment-row"  data-bs-toggle="collapse" data-bs-target={getReplyID()} aria-expanded="false" aria-controls={getReplyCtrl()}>
                <div className="p-2"><span className="round"><img src={pic} alt="user" width="50"/></span></div>
                <div className="comment-text w-100">
                    <h5>{author}</h5>
                    <div className="comment-footer">
                        {countStars()}
                        <span className="date">{getdate()}</span>
                    </div>
                    <p className="msg">{content}</p>
                    {replyNumber()}
                </div>
            </div>
            {printReplies()}
        </>;
    else
        return <></>;
}