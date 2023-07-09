import React, {useContext, useState} from "react";
import icons from '../../../components/icons';
import UserLogInput from "../../../components/input1";
import LargeCard from "../../../components/largeCard";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../contexts";

function Signup(props) {
    const { setToken } = useContext(UserContext);
    const [email, setEmail] = useState();
    const [password1, setPassword1] = useState();
    const [password2, setPassword2] = useState();
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        await signupUser({
            email: email,
            password1: password1,
            password2: password2,
            first_name: "",
            last_name: "",
        });
    }

    async function signupUser(credentials){
        fetch('http://localhost:8000/accounts/signup/',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                
                body: JSON.stringify(credentials),
            })
        .then((resquest) => resquest.json())
        .then((data) => {
            // console.log(data);

            var email_status = "";
            var pass1_status = "";
            var pass2_status = "";

            // var main_status = "";
            // if (data.detail)
                // main_status = data.detail;
            // document.getElementById("error-main").innerText = main_status;
        
            if (data.email)
                email_status = data.email;
                
            if (data.password2)
                pass2_status = data.password2;
            
            document.getElementById("error-email").innerHTML = email_status;
            document.getElementById("error-password2").innerHTML = pass2_status;
            document.getElementById("error-password1").innerHTML = pass1_status;
            if (data.password1){
                pass1_status = data.password1;
                var err_pass1 = document.getElementById("error-password1");
                err_pass1.innerHTML = "";
                for (let err of pass1_status){
                    var p = document.createElement("p");
                    p.innerHTML = err;
                    err_pass1.appendChild(p);
                }
            }

            if (!email_status && !pass1_status && !pass2_status)
                loginUser({
                    email: email,
                    password: password1,
                });
        });
    }

    async function loginUser(credentials){
        fetch('http://localhost:8000/accounts/login/',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(credentials),
            })
        .then((resquest) => resquest.json())
        .then((data) => {
            // console.log(data);
            const token = data.access;
            if (token){
                setToken(token);
                navigate("/accounts/myprofile/edit");
            }
        })
    }

    const contents = <>
        <h1 className="fw-light">Welcome!</h1>
        <form onSubmit={handleSubmit}>
            <img className="mt-4 mb-4" src={icons["logo"]} alt="" height="70" />

            <UserLogInput type="email" id="email" label="Email address" onChange={e => setEmail(e.target.value)} />

            <UserLogInput type="password" id="password1" label="Password" onChange={e => setPassword1(e.target.value)} />

            <UserLogInput type="password" id="password2" label="Confirm Password" onChange={e => setPassword2(e.target.value)} />

            <button className="w-100 btn btn-lg btn-blue" type="submit" href="/accounts/myprofile/edit">Sign up</button>
        </form>
        <br></br>
        <Link to="/accounts/login">I already have an account</Link>
    </>;

    return <>
        <main className="content">
            <LargeCard contents={contents}/>
        </main>
    </>;
}

export default Signup;