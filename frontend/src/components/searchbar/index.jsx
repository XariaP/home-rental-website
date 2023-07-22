import React, { useContext, useEffect, useState } from "react";
// import LargeCard from "../../components/largeCard";
import { UserContext, SearchContext } from "../../contexts";
import "./style.css";
import { Link } from "react-router-dom";


export default function SearchBar({numresults}) {
    const { token } = useContext(UserContext);
    const [ properties, setProperties ] = useState([]);
    // const [ beds, setBeds ] = useState(0);
    // const [ baths, setBaths ] = useState(0);
    // const [ guests, setGuests ] = useState(0);
    const {beds, baths, guests, search, setBeds, setBaths, setGuests, setSearch} = useContext(SearchContext);
    // console.log(useContext(SearchContext));

    // var beds = 0;
    // var baths = 0;
    // var max = 0;

    const searchLink = () => {
      var link = `?`;
      if (beds > 0)
        link += `num_beds=${beds}&`;
      if (baths > 0)
        link += `num_baths=${baths}&`;
      if (guests > 0)
        link += `num_guests=${guests}`;
      setSearch(link);

      document.getElementById('filter-button').click();
      return link;
    }

    function handleBedsChange(e) {
      setBeds(e.target.value);
    }
    function handleBathsChange(e) {
      setBaths(e.target.value);
    }
    function handleGuestsChange(e) {
      setGuests(e.target.value);
    }



    return <>
        <section className="py-5 text-center container">
          <div className="row">
            <div className="col-lg-6 col-md-8 mx-auto">
              <h1 className="fw-light">Rental Search</h1>
              <p>
                <a id="filter-button" className="btn btn-primary my-2" data-bs-toggle="collapse" href="#filterForm" role="button" aria-expanded="false" aria-controls="collapseExample">
                  Filter/Sort
                </a>
              </p>
              
              <form className="">
                <div className="collapse mb-3 " id="filterForm">  
                  <div className="card card-body searchbar">
                    <h4>Filter by</h4>
                    {/* <div className="input-group mb-3">
                      <label className="input-group-text btn-blue" htmlFor="inputGroupSelect01">Location</label>
                      <select className="form-select" id="inputGroupSelect01">
                        <option selected>Any</option>
                        <option value="1">Toronto, Canada</option>
                        <option value="2">Houston, Texas</option>
                        <option value="3">Montreal, Canada</option>
                      </select>
                    </div> */}

                    <label htmlFor="numguests" className="form-label filter-label mt-3">Number of Guests</label>
                    <div className="mb-3 options" onChange={handleGuestsChange}>
                      <input type="radio" className="btn-check" name="numguests" id="guest0" value="0" defaultChecked/>
                      <label className="btn btn-outline-primary" htmlFor="guest0">Any</label>
                      <input type="radio" className="btn-check" name="numguests" id="guest1" value="1"/>
                      <label className="btn btn-outline-primary" htmlFor="guest1">1</label>
                      <input type="radio" className="btn-check" name="numguests" id="guest2" value="2"/>
                      <label className="btn btn-outline-primary" htmlFor="guest2">2</label>
                      <input type="radio" className="btn-check" name="numguests" id="guest3" value="3"/>
                      <label className="btn btn-outline-primary" htmlFor="guest3">3</label>
                      <input type="radio" className="btn-check" name="numguests" id="guest4" value="4"/>
                      <label className="btn btn-outline-primary" htmlFor="guest4">4+</label>
                    </div>

                    <label htmlFor="numbeds" className="form-label filter-label mt-3">Number of Beds</label>
                    <div className="mb-3 options" onChange={handleBedsChange}>
                      <input type="radio" className="btn-check" name="numbeds" id="bed0" value="0" defaultChecked/>
                      <label className="btn btn-outline-primary" htmlFor="bed0">Any</label>
                      <input type="radio" className="btn-check" name="numbeds" id="bed1" value="1"/>
                      <label className="btn btn-outline-primary" htmlFor="bed1">1</label>
                      <input type="radio" className="btn-check" name="numbeds" id="bed2" value="2"/>
                      <label className="btn btn-outline-primary" htmlFor="bed2">2</label>
                      <input type="radio" className="btn-check" name="numbeds" id="bed3" value="3"/>
                      <label className="btn btn-outline-primary" htmlFor="bed3">3</label>
                      <input type="radio" className="btn-check" name="numbeds" id="bed4" value="4"/>
                      <label className="btn btn-outline-primary" htmlFor="bed4">4+</label>
                    </div>

                    <label htmlFor="numbaths" className="form-label filter-label mt-3">Number of Baths</label>
                    <div className="mb-3 options" onChange={handleBathsChange}>
                      <input type="radio" className="btn-check" name="numbaths" id="bath0" value="0" defaultChecked/>
                      <label className="btn btn-outline-primary" htmlFor="bath0">Any</label>
                      <input type="radio" className="btn-check" name="numbaths" id="bath1" value="1"/>
                      <label className="btn btn-outline-primary" htmlFor="bath1">1</label>
                      <input type="radio" className="btn-check" name="numbaths" id="bath2" value="2"/>
                      <label className="btn btn-outline-primary" htmlFor="bath2">2</label>
                      <input type="radio" className="btn-check" name="numbaths" id="bath3" value="3"/>
                      <label className="btn btn-outline-primary" htmlFor="bath3">3</label>
                      <input type="radio" className="btn-check" name="numbaths" id="bath4" value="4"/>
                      <label className="btn btn-outline-primary" htmlFor="bath4">4+</label>
                    </div>

                    {/* <label className="form-label filter-label mt-3"> Ammenities Included (Select all that apply)</label>
                    <div className="row g-3 mb-3 justify-content-center">
                      <div className="col-auto">
                        <input type="checkbox" className="btn-check" id="btn-check-outlined"/>
                        <label className="btn btn-outline-primary" htmlFor="btn-check-outlined">Hot Water</label>
                      </div>
                      <div className="col-auto">
                        <input type="checkbox" className="btn-check" id="btn-check-2-outlined"/>
                        <label className="btn btn-outline-primary" htmlFor="btn-check-2-outlined">Air conditioning</label>
                      </div>
                      <div className="col-auto">
                        <input type="checkbox" className="btn-check" id="btn-check-3-outlined"/>
                        <label className="btn btn-outline-primary" htmlFor="btn-check-3-outlined">Heater</label>
                      </div>
                      <div className="col-auto">
                        <input type="checkbox" className="btn-check" id="btn-check-4-outlined"/>
                        <label className="btn btn-outline-primary" htmlFor="btn-check-4-outlined">Wifi</label>
                      </div>
                      <div className="col-auto">
                        <input type="checkbox" className="btn-check" id="btn-check-5-outlined"/>
                        <label className="btn btn-outline-primary" htmlFor="btn-check-5-outlined">Free Parking</label>
                      </div>
                      <div className="col-auto">
                        <input type="checkbox" className="btn-check" id="btn-check-6-outlined"/>
                        <label className="btn btn-outline-primary" htmlFor="btn-check-6-outlined">TV</label>
                      </div>
                      <div className="col-auto">
                        <input type="checkbox" className="btn-check" id="btn-check-7-outlined"/>
                        <label className="btn btn-outline-primary" htmlFor="btn-check-7-outlined">Backyard</label>
                      </div>
                      <div className="col-auto">
                        <input type="checkbox" className="btn-check" id="btn-check-8-outlined"/>
                        <label className="btn btn-outline-primary" htmlFor="btn-check-8-outlined">Laundry Room</label>
                      </div>
                    </div> */}

                    {/* <h4 className="mt-3">Order by</h4>
                    <div className="mb-3 options">
                      <input type="radio" className="btn-check" name="order1" id="order-price"/>
                      <label className="btn btn-outline-primary" htmlFor="order-price">Price</label>
                      <input type="radio" className="btn-check" name="order1" id="order-rating"/>
                      <label className="btn btn-outline-primary" htmlFor="order-rating">Rating</label>
                    </div>
                    <div id="order-direction" className=" options">
                      <input type="radio" className="btn-check" name="order2" id="order-asc"/>
                      <label className="btn btn-outline-primary" htmlFor="order-asc">Highest to Lowest</label>
                      <input type="radio" className="btn-check" name="order2" id="order-desc"/>
                      <label className="btn btn-outline-primary" htmlFor="order-desc">Lowest to Highest</label>
                    </div> */}

                    {/* <Link className="btn btn-blue mt-3" to={searchLink()}>Search</Link> */}
                    <Link className="btn btn-blue mt-3" onClick={searchLink}>Search</Link>
                  </div>
                </div>
              </form>
              Showing {numresults} result(s)
            </div>
            
          </div>
        </section>
    </>;
}
