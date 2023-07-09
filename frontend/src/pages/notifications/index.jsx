// Copied from P1, Needs editing
import React, {useEffect, useContext, useState} from "react";
import { formatDistanceToNow } from 'date-fns';
// import "./style.css";
import icons from "../../components/icons";
import { UserContext } from "../../contexts";
import { useNavigate } from "react-router-dom";

function Notifications(props) {
  const [notifications, setNotifications] = useState([]);
  const { token } = useContext(UserContext);
  const navigate = useNavigate();
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [previousPageUrl, setPreviousPageUrl] = useState(null);


  async function get_notifications(url) {
    const apiUrl = url || "http://localhost:8000/notifications/";

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setNotifications(data.results);
        setNextPageUrl(data.next);
        setPreviousPageUrl(data.previous);
      });
  }

  useEffect(() => {
    get_notifications();
  }, []);

  function handleNextPage() {
    if (nextPageUrl) {
      get_notifications(nextPageUrl);
    }
  }

  function handlePreviousPage() {
    if (previousPageUrl) {
      get_notifications(previousPageUrl);
    }
  }

  function handleClick(id) {
    fetch(`http://localhost:8000/notifications/${id}/read/`,
    {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization' : `Bearer ${token}`,
        },
    }).then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      if (data.title.includes("Your")) {
        window.location.href = `/reservations`;
        // navigate('/reservations');
      }
      else if (data.title.includes("wants") || data.title.includes("cancel") ) {
        window.location.href = `/requests`;
        // navigate('/requests');
      }
      else if (data.title.includes("comment")) {
        window.location.href = `/properties/manage`;
        // navigate('/properties/manage');
      }
    })
    

  }

    return <>
      <div className="modal fade" id="notiModal" tabIndex="-1" aria-labelledby="notiModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header bar">
              <img className="modal-icon" src={icons['mail']} />
              <h1 className="modal-title fs-5" id="notiModalLabel">My Notifications</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div className="modal-body">
                
             <ul className="list-group list-group-flush border-bottom scrollarea">
                {Array.isArray(notifications) && notifications.map(notification => (
                  <li key={notification.id} className="list-group-item list-group-item-action py-3 lh-sm" aria-current="true">
                    {/* <button className="no-style" value={notification.id} onClick={handleClick}> */}
                    <button className="no-style" value={notification.id} onClick={(e) => handleClick(notification.id)}>
                      <div className="d-flex w-100 align-items-center justify-content-between">
                        <strong className="mb-1">{notification.title}</strong>
                        <small>{formatDistanceToNow(new Date(notification.created_at))} ago</small>
                      </div>
                      <div className="col-10 mb-1 small">{notification.message}</div>
                    </button>
                  </li>
                ))}
              </ul> 
              <div className="d-flex justify-content-between mt-3">
                <button
                  className="btn btn-outline-secondary"
                  disabled={!previousPageUrl}
                  onClick={handlePreviousPage}
                >
                  Previous
                </button>
                <button
                  className="btn btn-outline-secondary"
                  disabled={!nextPageUrl}
                  onClick={handleNextPage}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>;
}


export default Notifications;