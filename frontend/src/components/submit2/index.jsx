// Profile editor submit buttons
import React from "react";

export default function FormButton({ type, label, onClick}){
    return <>
        <div className="col-12">
            <button className="btn btn-primary" type={type} onClick={onClick}>{label}</button>
        </div>
    </>;
}