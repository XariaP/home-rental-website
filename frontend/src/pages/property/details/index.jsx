import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../contexts";
import { Link, useParams } from "react-router-dom";
import placeholder from "../../../assets/imgs/rental-placeholder.png";
import LargeCard from "../../../components/largeCard";
import BackButton from "../../../components/backbutton";


export default function Property(props) {
    const { token } = useContext(UserContext);
    const { propertyID } = useParams();
    const [ name, setName ] = useState("");
    const [ hostName, setHostName ] = useState("");
    const [ desc, setDesc ] = useState("");
    const [ address, setAddress ] = useState("");
    const [ pic, setPic ] = useState(null);
    const [ host, setHost ] = useState(null);
    const [ beds, setBeds ] = useState(0);
    const [ baths, setBaths ] = useState(0);
    const [ max, setMax ] = useState(0);
    const [ stuff, setStuff ] = useState([]);

    async function viewInfo(){
        var is_valid;
        fetch(`http://localhost:8000/properties/${propertyID}/details/`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            })
        .then((request) => {
            is_valid = request.ok;
            return request.json();
        })
        .then((data) => {
            setHost(data.host);
            setName(data.name);
            setDesc(data.description);
            setAddress(data.address);
            setPic(data.img);
            
            setAddress(data.address);
            setBeds(data.num_beds);
            setBaths(data.num_baths);
            setMax(data.num_guests);
            setStuff(data.amenities);
        })
    }

    async function getHostName(){
        var is_valid;
        fetch(`http://localhost:8000/accounts/profile/${host}/view/host/`,
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
            var fullname = data.first_name + " " + data.last_name;
            if (fullname != " ")
                setHostName(fullname);
            else
                setHostName(data.email);
            
        })
    }

    useEffect(() => {
        viewInfo();
    }, []);

    useEffect(() => {
        if (token && host)
            getHostName();
    }, [host]);

    const profileLink = `/accounts/profile/${host}/view/host`;
    const commentsLink = `/comments/property/${propertyID}/view/`;

    const getPic = () => {
        if (pic)
            return <>
                <img className="housepic" src={pic}/>
            </>;
        else
        return <>
            <img className="housepic" src={placeholder}/>
        </>;
    }

    function printHostName() {
        if (token){
            return <>
                <Link className="btn btn-secondary" to={profileLink}>Contact Host: {hostName}</Link>
            </>;
        }
        else {
            return;
        }
    }
    const reserveLink = `/reserve/property/${propertyID}`;
    const signupLink = "/accounts/signup";

    function reserveButton() {
        if (token){
            return <>
                <Link className="btn btn-success" to={reserveLink}>Book now!</Link>
                {/* <Link className="btn btn-success" to={reserveLink} style={{width:"50vw"}}>Book now!</Link> */}
            </>;
        }
        else {
            return <>
                <Link className="btn btn-danger" to={signupLink}>Sign up now to book!</Link>
            </>;
        }
    }

    const getStuff = () => {
        if (stuff)
            return <>
                <p className="ptitle">Ammenities:</p>
                    <p>
                    {stuff.map(amenity => {
                        return <span key={amenity} className="large-pill badge rounded-pill text-bg-darkblue">{amenity}</span>;
                    })}
                </p>
            </>
        else
        return <>
            <p className="ptitle">Ammenities:</p>
                <p>
                    <span className="large-pill badge rounded-pill text-bg-darkblue">None specified</span>
                </p>
            </>
    }
    const contents = () => {
        return <>
        {/* <button
            className="btn text-bg-primary"
            onClick={() => navigate(-1)} style={{width:"50vw"}}>
            Back to search
        </button> */}
        
        <div className="housedetails">
            <div className="col">
                <p className="ptitle heading">{name}</p>

                {getPic()}
                
                <p>
                    <span className="large-pill badge rounded-pill text-bg-darkblue">{baths} Baths</span>
                    <span className="large-pill badge rounded-pill text-bg-darkblue">{beds} Beds</span>
                    <span className="large-pill badge rounded-pill text-bg-darkblue">{max} Guests Maximum</span>
                </p>
                
                <p className="ptitle">Description:</p>
                <p> {desc}</p>
                
                <p className="ptitle">Address:</p>
                <p>{address}</p>

                {getStuff()}
                {/* <p> <span className="ptitle">Baths:</span> {baths}</p>
                
                <p> <span className="ptitle">Beds:</span> {beds}</p>
                 */}
                {/* <p> <span className="ptitle">Max occupancy:</span> {max}</p> */}
                <div>
                    {printHostName()}
                </div>

                <div style={{marginTop:20}}>
                    <Link
                        to={commentsLink}
                        className="btn text-bg-primary">
                        Read Comments
                    </Link>
                </div>
                
                <div style={{marginTop:20}}>
                    {reserveButton()}
                </div>
    
            </div>
        </div>

        </>;
    }

    return <>
        <BackButton />
        <LargeCard contents={contents()} />
    </>;
}