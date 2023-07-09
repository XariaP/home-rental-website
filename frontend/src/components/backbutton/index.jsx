import { useNavigate } from "react-router-dom";


export default function BackButton() {
    const navigate = useNavigate();
    return <>
        <button
            className="btn text-bg-primary"
            onClick={() => navigate(-1)} style={{position:"fixed", margin:"10px", zIndex:"100"}}>
            Go Back
        </button>
    </>;
}