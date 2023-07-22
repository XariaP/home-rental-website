import React, {useContext, useEffect, useState} from "react";
import icons from '../../../components/icons';
import { UserContext } from "../../../contexts";

function Logout() {
    const { token, setToken } = useContext(UserContext);
    const [msg, setMsg] = useState("Not logged in");

    // When page loads, clear token for user session
    useEffect(() => {
        if (token){
            setToken("");
            setMsg("Logout successful!");
        }
        else {
            setMsg("Not logged in");
        }
    }, []);

    // Display message on screen for successful or unsuccessful log out
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