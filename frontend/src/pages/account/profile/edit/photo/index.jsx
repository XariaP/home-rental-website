import React, { useContext, useState } from "react";
import FormButton from "../../../../../components/submit2";
import { UserContext } from "../../../../../contexts";

import ImageUploader from 'react-image-upload'
import 'react-image-upload/dist/index.css'

// Allows user to change their profile image
export default function EditAvatar({onChange}) {
    const { token } = useContext(UserContext);
    const [pic, setPic] = useState(null);

    // Get the image uploaded by the user
    function getImageFileObject(imageFile) {
        setPic(imageFile.file);
    }
    
    // Remove image uploaded by the user
    function runAfterImageDelete(file) {
        setPic(null);
    }

    // Attempt to update the user's profile with the new image
    async function editInfo(updates){
        var is_valid;
        fetch('http://localhost:8000/accounts/myprofile/edit/',
            {
                method: 'PATCH',
                headers: {
                    'Authorization' : `Bearer ${token}`,
                },
                
                body: updates,
            })
        .then((request) => {
            is_valid = request.ok;
            return request.json();
        })
        .then((data) => {
            var pic_status = "";

            if (is_valid){
                pic_status = "Upload successful: " + data.avatar;
            }
            else {
                // Check for error messages to output
                if (data.avatar)
                    pic_status = data.avatar;
            }
            document.getElementById("error-pic").innerHTML = pic_status;
            
        });
    }

    /* Displays an error if the user attempts to save without uploading an image first.
       Changes the user's profile image if valid image was uploaded. */
    const handleSubmit = async e => {
        e.preventDefault();
        let form_data = new FormData();
        if (pic){
            form_data.append('avatar', pic, pic.name);
            await editInfo(form_data);
        }
        else {
            document.getElementById("error-pic").innerHTML = "No file was selected";
        }
    }

    // Displays the layout for the image upload section of the settings page
    return <>
        <div className="tab-pane fade" id="v-pills-photo" role="tabpanel" aria-labelledby="v-pills-photo-tab" tabIndex="0">
            <form className="row g-3 mt-1" onSubmit={handleSubmit}>
                <h4>Profile Photo</h4>

                <ImageUploader
                    onFileAdded={(img) => getImageFileObject(img)}
                    onFileRemoved={(img) => runAfterImageDelete(img)}
                />

                <p className="error" id="error-pic"></p>

                <FormButton type="submit" label="Upload Photo" onClick={()=>{onChange(pic)}} />
                
            </form>
        </div>
    </>;
}