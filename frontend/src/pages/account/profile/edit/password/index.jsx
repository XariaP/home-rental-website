import React, { useContext, useState } from "react";
import ProfileInput from "../../../../../components/input2";
import FormButton from "../../../../../components/submit2";
import { UserContext } from "../../../../../contexts";

export default function EditPassword(props) {
    const { token } = useContext(UserContext);
    const [password1, setPassword1] = useState();
    const [password2, setPassword2] = useState();

    async function editInfo(updates){
        var is_valid;
        fetch('http://localhost:8000/accounts/myprofile/edit/',
            {
                method: 'PATCH',
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
            var pass1_status = "";
            var pass2_status = "";

            var err_pass1 = document.getElementById("error-password1");
            err_pass1.innerHTML = pass1_status;
                
            if (is_valid){       
                pass1_status = "Password changed successfully";
                err_pass1.innerHTML = pass1_status;
            }
            else {
                if (data.password1){
                    pass1_status = data.password1;
                    
                    for (let err of pass1_status){
                        var p = document.createElement("p");
                        p.innerHTML = err;
                        err_pass1.appendChild(p);
                    }
                }

                if (data.password2)
                    pass2_status = data.password2;
            }

            document.getElementById("error-password2").innerHTML = pass2_status;
        })
    }

    const handleSubmit = async e => {
        e.preventDefault();

        await editInfo({
            password1: password1,
            password2: password2,
        });
    }

    const handleChange = (e, type) => {
        if (type === "p1")
            setPassword1(e.target.value);
        else if (type === "p2")
            setPassword2(e.target.value);
        
        document.getElementById("error-password1").innerHTML = "";
    }

    return <>
        <div className="tab-pane fade" id="v-pills-password" role="tabpanel" aria-labelledby="v-pills-password-tab" tabIndex="0">
            <form className="row g-3 mt-1" onSubmit={handleSubmit}>   
                <h4>Account Information</h4>
                
                <ProfileInput type="password" id="password1" label="New Password" onChange={e => handleChange(e, "p1")} />
                
                <ProfileInput type="password" id="password2" label="Retype New Password" onChange={e => handleChange(e, "p2")} />
                
                <FormButton type="submit" label="Change Password" />
            </form>
        </div>
    </>;
}