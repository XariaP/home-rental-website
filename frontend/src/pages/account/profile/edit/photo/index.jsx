import React, { useContext, useState } from "react";
import FormButton from "../../../../../components/submit2";
import { UserContext } from "../../../../../contexts";

// https://www.npmjs.com/package/react-image-upload
import ImageUploader from 'react-image-upload'
import 'react-image-upload/dist/index.css'

export default function EditAvatar({onChange}) {
    const { token } = useContext(UserContext);
    const [pic, setPic] = useState(null);
    // const [content, setContent] = useState("");
    // const [title, setTitle] = useState("");

    function getImageFileObject(imageFile) {
        // console.log({ imageFile }.file);
        setPic(imageFile.file);
        // console.log(pic);
    }
    
    function runAfterImageDelete(file) {
        // console.log({ file })
        setPic(null);
    }

    async function editInfo(updates){

        var is_valid;
        fetch('http://localhost:8000/accounts/myprofile/edit/',
            {
                method: 'PATCH',
                headers: {
                    // 'Content-Type': 'multipart/form-data',
                    'Authorization' : `Bearer ${token}`,
                },
                
                body: updates,
            })
        .then((request) => {
            is_valid = request.ok;
            return request.json();
        })
        .then((data) => {
            // console.log(data);

            var pic_status = "";

            if (is_valid){
                pic_status = "Upload successful: " + data.avatar;
            }
            else {
                if (data.avatar)
                    pic_status = data.avatar;
            }
            document.getElementById("error-pic").innerHTML = pic_status;
            
        });
    }

    const handleSubmit = async e => {
        e.preventDefault();
        let form_data = new FormData();
        if (pic){
            form_data.append('avatar', pic, pic.name);
            // for (const value of form_data.values()) {
            //     console.log(value);
            // }
            await editInfo(form_data);
        }
        else {
            document.getElementById("error-pic").innerHTML = "No file was selected";
        }
    }

    return <>
        <div className="tab-pane fade" id="v-pills-photo" role="tabpanel" aria-labelledby="v-pills-photo-tab" tabIndex="0">
            <form className="row g-3 mt-1" onSubmit={handleSubmit}>
                <h4>Profile Photo</h4>

                {/* <div className="input-group mb-3">
                    <input type="file" className="form-control" id="userphotoFile" accept="image/*" onChange={handleImageChange}/>
                    <button className="btn btn-outline-danger" type="reset" onClick={e => setPic(null)}>Remove</button>
                </div> */}

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