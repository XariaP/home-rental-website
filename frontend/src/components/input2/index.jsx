// Normal Input
import React from "react";

export default function ProfileInput({ type, label, id, onChange, placeholder, data}){
    const getErrorID = "error-" + id;

    return <>
        <div className="col-md-4">
            <label htmlFor={id} className="form-label">{label}</label>
            <input type={type} className="form-control" id={id} onChange={onChange} placeholder={placeholder} value={data} />
            <p className="error" id={getErrorID}></p>
        </div>
    </>;
}