import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../../../contexts";
import { useParams } from "react-router-dom";

import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js";
import ReplyCard from "../reply";
import ReplyBox from "../replyarea";

export default function CommentCard({type, comment, refresh}) {
    const { token } = useContext(UserContext);
    const { userID } = useParams();
    const [pic, setPic] = useState(null);
    const ID = comment.id;
    const uID = comment.written_by;
    const author = comment.posted_by;
    const stars = comment.rating;
    const content = comment.content;
    const date = comment.date;
    const replies = comment.replies;

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

    useEffect(() => {
        getPhoto();
    })

    const getdate = () => {
        return date.substring(0, 10);
    }

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

    async function deleteComment(){
        fetch(`http://localhost:8000/comments/user/${userID}/delete/${ID}/`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization' : `Bearer ${token}`,
                },
            })
        .then((response) => {
            refresh();
            return response.json();
        })
    }

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

    const getReplyID = () => {
        return "#reply" + ID;
    }

    const getReplyCtrl = () => {
        return "reply" + ID;
    }
    
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