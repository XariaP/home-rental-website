import React, {useContext, useState} from "react";
import icons from '../../../components/icons';
import { Link, useNavigate } from "react-router-dom";
import { PageContext, UserContext } from "../../../contexts";
import LargeCard from "../../../components/largeCard";
import UserLogInput from "../../../components/input1";

function Login(props) {
    const { setPage } = useContext(PageContext);    // Store current page to display
    const { setToken } = useContext(UserContext);   // Store current user's token for this session
    const [email, setEmail] = useState();           // Store user's email
    const [password, setPassword] = useState();     // Store user's password
    const navigate = useNavigate();

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
            // Display error
            if (data.detail){
                document.getElementById("error-main").innerText = data.detail;
            }
            else {
                document.getElementById("error-main").innerText = "";
            }

            // Display error if email incorrect
            if (data.email){
                document.getElementById("error-email").innerText = data.email;
            }
            else {
                document.getElementById("error-email").innerText = "";
            }
            
            // Display error if password incorrect
            if (data.password){
                document.getElementById("error-password").innerText = data.password;
            }
            else {
                document.getElementById("error-password").innerText = "";
            }
            
            // If user authenticated redirect to home page
            if (data.access){
                const token = data.access;
                setToken(token);
                setPage("search");
                navigate("/home");
            }
        });
    }

    // Handle credentials when submited
    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
            email: email,
            password: password,
        });
    }

    // Display layout for logging in
    const contents = <>
        <h1 className="fw-light">Welcome Back!</h1>                
        <form onSubmit={handleSubmit}>
            <img className="mb-4" src={icons["host"]} alt="" height="90" />
            
            <p className="error" id="error-main"></p>

            <UserLogInput type="email" id="email" label="Email address" onChange={e => setEmail(e.target.value)} />
            
            <UserLogInput type="password" id="password" label="Password" onChange={e => setPassword(e.target.value)} />
        
            <button className="w-100 btn btn-lg btn-blue" type="submit">Log in</button>
        </form>
        <br></br>
        <Link to="/accounts/signup">Create an account</Link>
    </>;

    return <>
        <main className="content">
            <LargeCard contents={contents}/>
        </main>
    </>;
}

export default Login;