import React, { useContext, useEffect, useState } from "react";
import ProfileInput from "../../../../../components/input2";
import FormButton from "../../../../../components/submit2";
import { UserContext } from "../../../../../contexts";

// Displays inputs for changing general user information
export default function EditGeneralUserInfo(props) {
    const { token } = useContext(UserContext);      // Stores token for current user session
    const [fname, setFname] = useState();
    const [lname, setLname] = useState();
    const [email, setEmail] = useState();
    const [phonenum, setPhonenum] = useState();

    // Retrieve previous user information to prefill input boxes
    async function viewInfo(){
        var is_valid;
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
            return request.json();
        })
        .then((data) => {
            setFname(data.first_name);
            setLname(data.last_name);
            setEmail(data.email)
            setPhonenum(data.phone_number);  
        })
    }

    // Retrieve information when page loads
    useEffect(() => {
        viewInfo();
    }, [])

    // Update user information with the changes made in the input boxes
    async function editInfo(updates){
        var is_valid;
        fetch('http://localhost:8000/accounts/myprofile/edit/',
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization' : `Bearer ${token}`,
                },
                
                body: JSON.stringify(updates),
            })
        .then((request) => {
            is_valid = request.ok;
            return request.json();
        })
        .then((data) => {
            var email_status = "";
            var phoneNum_status = "";
            var main_status = "";

            // Variables to hold elements which will display any error messages
            var err_email = document.getElementById("error-email");
            var err_phoneNum = document.getElementById("error-phonenum");
            var status = document.getElementById("status");
               
            // Request successful
            if (is_valid){
                main_status = "Profile updated successfully"; 
                if (!fname || !lname || !email || !phonenum)
                    viewInfo();
            }
            else {
                // Collect error messages from response
                if (data.email)
                    email_status = data.email;

                if (data.phone_number){
                    phoneNum_status = data.phone_number;
                }
            }

            // Output error messages
            err_email.innerHTML = email_status;
            err_phoneNum.innerHTML = phoneNum_status;
            status.innerHTML = main_status;
        });
    }

    // Saves the changes made in the input boxes and updates the user information accordingly unless field was left blank
    const handleSubmit = async e => {
        e.preventDefault();
        var updates = {};
        if (fname)
            updates['first_name'] = fname;
        if (lname)
            updates['last_name'] = lname;
        if (email)
            updates['email'] = email;
        if (phonenum)
            updates['phone_number'] = phonenum;
        
        await editInfo(updates);
    }

    // Automatically update variables to reflect each change the user makes in real-time
    const handleChange = (e, type) => {
        if (type === "fname")
            setFname(e.target.value);
        else if (type === "lname")
            setLname(e.target.value);
        else if (type === "email")
            setEmail(e.target.value);
        else if (type === "phonenum")
            setPhonenum(e.target.value);
        // Clear display message when a change is made
        document.getElementById("status").innerHTML = "";
    }

    // Displays the layout for the general section of the settings page
    return <>
        <div className="tab-pane fade show active" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab" tabIndex="0">
            <form className="row g-3 mt-1" onSubmit={handleSubmit}>
                <h4>Basic Information</h4>
                
                <ProfileInput type="text" id="first_name" label="First Name" data={fname} onChange={e => handleChange(e, "fname")} />
                
                <ProfileInput type="text" id="last_name" label="Last Name" data={lname} onChange={e => handleChange(e, "lname")} />

                <h4>Contact Information</h4>
                
                <ProfileInput type="email" id="email" label="Email" data={email} onChange={e => handleChange(e, "email")} />      
                
                <ProfileInput type="text" id="phonenum" label="Phone #" data={phonenum} onChange={e => handleChange(e, "phonenum")} placeholder="xxx-xxx-xxxx" />

                <FormButton type="submit" label="Save Changes" onClick={()=>{}} />

                <p className="error" id="status"></p>
            </form>
        </div>
    </>;
}