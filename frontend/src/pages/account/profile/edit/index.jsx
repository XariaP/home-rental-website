import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditGeneralUserInfo from "./general";
import EditPassword from "./password";
import EditAvatar from "./photo";
import { PageContext, UserContext } from "../../../../contexts";

function EditProfile(props) {
    const { token } = useContext(UserContext);
    const { setPage } = useContext(PageContext);
    const [pic, setPic] = useState(null);
    const [fname, setFname] = useState();
    const [lname, setLname] = useState();
    const [email, setEmail] = useState();
    const [phonenum, setPhonenum] = useState();

    const [msg, setMsg] = useState(null);

    async function viewInfo(){
        var is_valid;
        var code;

        fetch('http://localhost:8000/accounts/myprofile/edit/',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization' : `Bearer ${token}`,
                },
            })
        .then((request) => {
            is_valid = request.ok;
            code = request.status;
            return request.json();
        })
        .then((data) => {
            setPic(data.avatar);
            setFname(data.first_name);
            setLname(data.last_name);
            setEmail(data.email);
            setPhonenum(data.phone_number);
            
            if (code == 401){
                setMsg("You are not logged in");
            }
        })
    }

    useEffect(() => {
        viewInfo();
        setPage("profile");
    });

    const handlePicUpdate = (pic) => {
        setPic(pic);
    }

    const avatar = <>
        <div className="avatar-center">
            <img className="avatar" src={pic}/>
        </div>
    </>;

    const tabs = <>
        <div className="d-flex justify-content-center mt-3">
            <div className="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                <button className="nav-link active" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="false">Profile</button>
                <button className="nav-link" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-photo" type="button" role="tab" aria-controls="v-pills-photo" aria-selected="false">Photo</button>
                <button className="nav-link" id="v-pills-password-tab" data-bs-toggle="pill" data-bs-target="#v-pills-password" type="button" role="tab" aria-controls="v-pills-password" aria-selected="false">Password</button>
                <Link className="btn btn-light float-end" to="/accounts/myprofile/view">Exit</Link>
            </div>
        </div>
    </>;

    if (msg)
        return <>
        <main className="profile content">
            <div className="container height-100 d-flex justify-content-center align-items-center mt-4 mb-4">
                <div className="card text-center">
                    <div className="row py-5 px-5">
                        <div className="mx-auto">
                            <h3 className="fw-light">{msg}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </>;

    return <>
        <main className="content whitebg">
            <div className="profile">
                <div className="float-md-start mx-3">
                    {avatar}
                    {tabs}
                </div>

                <div className="tab-content" id="v-pills-tabContent">
                    <EditGeneralUserInfo />
                    <EditAvatar onChange={handlePicUpdate}/>
                    <EditPassword />
                </div>
            </div>
        </main>
    </>;
}

export default EditProfile;