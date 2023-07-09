// Floating Input
import React from "react";

export default function UserLogInput({ type, label, id, onChange}){
    const getErrorID = "error-" + id;

    return <>
        <div className="form-floating">
            <input type={type} className="form-control" id={id} onChange={onChange} />
            <label htmlFor={id}>{label}</label>
            <p className="error" id={getErrorID}></p>
        </div>
    </>;
}