import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../../../contexts";
import { useParams } from "react-router-dom";
import CommentPage from "../layout";
import CommentCard from "../comment";
import CommentBox from "../textarea";
import icons from '../../../components/icons';

// import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js";

export default function UserComment(props) {
    const { token } = useContext(UserContext);
    const { userID, pageNum } = useParams();
    const [ commentList, setCommentList ] = useState([]);
    const [ comment, setComment ] = useState([]);
    const [ total, setTotal ] = useState(1);
    const [ datacount, setDataCount ] = useState(0);

    const [msg, setMsg] = useState("");

    var pg = 1;
    if (pageNum)
        pg = pageNum;
    
    const link = `/comments/user/${userID}/view/page/`;

    async function getComments(){
        var is_valid;
        var code;
        fetch(`http://localhost:8000/comments/user/${userID}/view/?page=${pg}`,
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
                    setMsg("This user does not exist");
                }
                else if (code == 403){
                    setMsg("You are not permitted to view comments about this user");
                }
                else if (code == 401){
                    setMsg("You are not logged in");
                }
            }
        })
    }

    useEffect(() => {
        getComments();
    }, [pg])

    useEffect(() => {
        if (datacount == 0){
            setComment(<>
                <div style={{padding:20}}>No comments yet</div>
            </>);
        }
        else {
            setComment(<>
                {commentList.map(comment => (
                    <CommentCard key={comment.id} type="user" comment={comment} refresh={(handleRefresh)}/>
                ))}
            </>);
        }
    }, [commentList])

    async function handleRefresh() {
        // console.log(total, datacount);
        await getComments();
        // if (datacount % 5 == 0){
        //     pg = parseInt(total) + 1;
        //     navigate(link + pg);
        // }
        // else
        //     navigate(link + total);
    }

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

    const allowed = () => {
        return <>
            <CommentPage type="user" content={comment} page={pg} link={link} total={total}/>
            <CommentBox type="user" refresh={handleRefresh}/>
        </>;
    }

    const show_content = (msg) => {
        if (msg)
            return forbidden(msg);
        else
            return allowed();
    }
    
    return <>
        <main className="content">
            {show_content(msg)}
        </main>
    </>;
}