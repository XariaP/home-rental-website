import React, { useContext } from "react";
import { SearchContext } from "../../contexts";
import "./style.css";
import { Link } from "react-router-dom";


export default function SearchBar({numresults}) {
    const {beds, baths, guests, search, setBeds, setBaths, setGuests, setSearch} = useContext(SearchContext);

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
