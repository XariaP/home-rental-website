import React, {useContext, useEffect, useState} from "react";
import icons from '../../../components/icons';
import { UserContext } from "../../../contexts";

function Logout() {
    const { token, setToken } = useContext(UserContext);
    const [msg, setMsg] = useState("Not logged in");

    async function logoutUser(){
        await fetch('http://localhost:8000/accounts/logout/',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'authorization': `Bearer ${token}`,
                }
            })
        .then((resquest) => resquest.json())
        .then((data) => {
        })
    }

    useEffect(() => {
        if (token){
            setToken("");
            setMsg("Logout successful!");
        }
        else {
            setMsg("Not logged in");
        }
    }, []);

    useEffect(() => {
        // logoutUser();
        // setMsg("Logout successful!");
        // navigate("/home");
    }, [token]);


    return <>
        <main className="content">
          <div className="container height-100 d-flex justify-content-center align-items-center mt-4 mb-4">
            <div className="card text-center">
                <div className="row py-5 px-5">
                    <div className="mx-auto">
                        <img className="mb-4" src={icons["logo"]} alt="" height="90" />
                        <h1 className="fw-light">{msg}</h1>
                    </div>
                </div>
            </div>
          </div>
        </main>
    </>;
}

export default Logout;