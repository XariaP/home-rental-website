import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../../../contexts";
import { useParams } from "react-router-dom";

// import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js";

export default function ReplyCard({reply, refresh}) {
    const { token } = useContext(UserContext);
    const { propertyID } = useParams();
    const [pic, setPic] = useState(null);
    // const ID = reply.id;
    const uID = reply.written_by;
    const author = reply.posted_by;
    const stars = reply.rating;
    const content = reply.content;
    const date = reply.date;

    const [ owner, setOwner ] = useState(null);

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
            // console.log(token);
            return response.json();
        })
        .then((data) => {
            setOwner(data.host);
        })
    }

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
            // console.log(token);
            return response.json();
        })
        .then((data) => {
            setPic(data.avatar);
        })
    }

    useEffect(() => {
        getPhoto();
        getProperty();
    })

    const getdate = () => {
        return date.substring(0, 10);
    }

    async function deleteComment(){
        // fetch(`http://localhost:8000/comments/user/${userID}/delete/${ID}/`,
        //     {
        //         method: 'DELETE',
        //         headers: {
        //             // 'Content-Type': 'application/json',
        //             // 'Accept': 'application/json',
        //             'Authorization' : `Bearer ${token}`,
        //         },
        //     })
        // .then((response) => {
        //     refresh();
        //     return response.json();
        // })
    }

    const label = () => {
        if (owner == uID)
            return <>
                <span className="label label-success">Host</span> <span className="action-icons"></span>
            </>;
        // else
        //     return <>
        //         <span className="label label-success">Host</span> <span className="action-icons"></span>
        //     </>;

    }
    
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