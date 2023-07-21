import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../../../contexts";
import { useParams } from "react-router-dom";
import CommentCard from "../comment";
import CommentBox from "../textarea";
import CommentPage from "../layout";
import icons from '../../../components/icons';

export default function PropertyComment(props) {
    const { token } = useContext(UserContext);
    const { propertyID, pageNum } = useParams();
    const [ commentList, setCommentList ] = useState(null);
    const [ comment, setComment ] = useState([]);
    const [ total, setTotal ] = useState(1);
    const [ datacount, setDataCount ] = useState(0);

    const [msg, setMsg] = useState("");

    var pg = 1;
    if (pageNum)
        pg = pageNum;

    const link = `/comments/property/${propertyID}/view/page/`;

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

    useEffect(() => {
        getComments();
    }, [pg])

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

    async function handleRefresh() {
        await getComments();
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
            <CommentPage type="property" content={comment} page={pg} link={link} total={total}/>
            <CommentBox type="property" refresh={handleRefresh}/>
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