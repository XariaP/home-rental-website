import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../contexts";
import { Link, useParams } from "react-router-dom";
import placeholder from "../../../assets/imgs/rental-placeholder.png";
import icons from "../../../components/icons";
import LargeCard from "../../../components/largeCard";
import BackButton from "../../../components/backbutton";
import "../book/styles.css"

export default function BookingPopup(props) {
    const { token } = useContext(UserContext);
    const { propertyID } = useParams();

    return <>
    <main className="content">      
        <div className="d-flex justify-content-center container mt-3 mb-3">
            <div className="card p-3 bg-white"><i className="fa fa-apple"></i>
                <div className="container">
                    <div className="card p-4 mt-3">
                        <div className="row g-3">
                            <div className="col-12 mb-2">
                                <h4>Room Reservation Details</h4>
                            </div>
                            <div className="col-lg-6 col-md-12">
                                <div className="form-floating">
                                    <p className="form-control">2023-02-27</p>
                                    <label>CHECK-IN</label>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12">
                                <div className="form-floating">
                                    <p className="form-control">2023-02-29</p>
                                    <label>CHECK-OUT</label>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12">
                                <div className="form-floating">
                                    <p className="form-control">3</p>
                                    <label>ADULTS(18+)</label>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12">
                                <div className="form-floating">
                                    <p className="form-control">2</p>
                                    <label>CHILDREN(0-17)</label>
                                </div>
                            </div>
                        </div>
                        <div className="stats">
                            <div className="d-flex justify-content-between p-price"><span>PER NIGHT</span><span>$510</span></div>
                            <div className="d-flex justify-content-between p-price"><span>$510 x 2 NIGHT(S)</span><span>$1,010</span></div>
                            <div className="d-flex justify-content-between p-price"><span>CLEANING FEE</span><span>$199</span></div>
                            <div className="d-flex justify-content-between p-price"><span>SERVICE FEE</span><span>$199</span></div>
                            <div className="d-flex justify-content-between p-price"><span>TAXES</span><span>$280</span></div>
                            <div className="d-flex justify-content-between total font-weight-bold mt-2"><span>Total</span><span>$1,688.00</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
    
    </>
}