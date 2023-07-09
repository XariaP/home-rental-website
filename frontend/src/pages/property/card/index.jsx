import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../contexts";
import { Link, useParams } from "react-router-dom";
// import house from "../../../assets/imgs/house-1477041__340.jpg";
import house from "../../../assets/imgs/rental-placeholder.png";
import icons from "../../../components/icons";


export default function PropertyCard({rental}) {
    const { token } = useContext(UserContext);
    // const [ name, setName ] = useState("");
    // const [ desc, setDesc ] = useState("");
    // const [ address, setAddress ] = useState("");
    // const [ pic, setPic ] = useState(null);
    const [ beds, setBeds ] = useState(0);
    const [ baths, setBaths ] = useState(0);
    const [ max, setMax ] = useState(0);

    const [ loaded, setLoaded ] = useState(null);
    const [myID, setMyID] = useState(null);

    const name = rental.name;
    const desc = rental.description;
    const add = rental.address;
    const pic = rental.img;
    const host = rental.host;
    const ID = rental.id;
    

    async function viewInfo(){
        var is_valid;
        fetch(`http://localhost:8000/properties/${ID}/details/`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    // 'Authorization' : `Bearer ${token}`,
                },
            })
        .then((request) => {
            is_valid = request.ok;
            return request.json();
        })
        .then((data) => {
            //console.log(data, "k");
            setBeds(data.num_beds);
            setBaths(data.num_baths);
            setMax(data.num_guests);
            setLoaded(true);
        })
    }

    async function viewUser(){
        fetch('http://localhost:8000/accounts/myprofile/view/',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization' : `Bearer ${token}`,
                },
            })
        .then((request) => {
            return request.json();
        })
        .then((data) => {
            setMyID(data.id);
        })
    }

    useEffect(() => {
        viewInfo();
        viewUser();
    }, []);

    const viewLink = `/properties/${ID}/details`;
    const editLink = `/properties/${ID}/update`;
    const commentsLink = `/comments/property/${ID}/view`;

    function getAction(){
        if (host == myID){
            return <>
                <Link type="button" className="btn btn-sm btn-outline-secondary" to={editLink}>Edit</Link>
            </>;
        }
        else {
            return <>
                <Link type="button" className="btn btn-sm btn-outline-secondary" to={viewLink}>View</Link>
            </>;
        }
    }

    function getLink(){
        // console.log(host, myID);
        if (host == myID){
            return editLink;
        }
        else
            return viewLink;
    }

    function getPic() {
        if (pic)
            return pic;
        return house;
    }

    if (loaded)
        return <>
            {/* {name}
            {desc}
            {add}
            {pic}
            {host} */}
            <div className="col">
                <div className="card shadow-sm">
                    {/* <span className='position-absolute card-rating-badge translate-middle badge rounded-pill'> <img src={icons['star']}/></span> */}
                    <Link to={getLink()}>
                        <img className="bd-placeholder-img card-img-top" width="100%" height="225" src={getPic()}/>
                    </Link>
                    <div className="card-body">
                        <p className="card-text badge-group">
                            {/* <span className="badge rounded-pill text-bg-darkblue"> */}
                            {/* $150/night */}
                            {/* </span> */}
                            <span className="badge rounded-pill text-bg-darkblue">
                            {beds} Bed
                            </span>
                            <span className="badge rounded-pill text-bg-darkblue">
                            {baths} Bath
                            </span>
                            <span className="badge rounded-pill text-bg-darkblue">
                            {max} Guests Max
                            </span>
                        </p>
                        <p className="text-bold">{name}</p>
                        <p className="card-text">{desc}</p>
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="btn-group">
                                {getAction()}
                                <Link type="button" className="btn btn-sm btn-outline-secondary" to={commentsLink}>Comments</Link>
                            </div>
                            <small className="text-muted text-center">{add}</small>
                        </div>
                    </div>
                </div>
            </div>
        </>;
}