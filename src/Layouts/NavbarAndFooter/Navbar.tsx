import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import { SpinnerLoading } from "../Utils/SpinnerLoading";


export const Navbar = () => {
  const { oktaAuth, authState } = useOktaAuth();
  if (!authState) {
    <SpinnerLoading />
  }
  const handleLogout = async () => oktaAuth.signOut();
  const alertMe = () => {
    alert('hi');
  }
  console.log(authState);
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">My Library</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link active" aria-current="page" to="/home">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/search">Search Books</NavLink>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                Dropdown link
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">Action</a></li>
                <li><a className="dropdown-item" href="#">Another action</a></li>
                <li><a className="dropdown-item" href="#">Something else here</a></li>
              </ul>
            </li>
          </ul>
          <ul className='navbar-nav ms-auto'>
            {
              !authState?.isAuthenticated ?
                <li className='nav-item m-1'>
                  <Link type="button" href="#" className='btn btn-primary' to="/login">Sign In</Link>
                </li>
                :
                <li className='nav-item m-1'>
                  <button type="button" className='btn btn-outline-danger' onClick={handleLogout}>Sign Out</button>
                </li>
            }
          </ul>
        </div>
      </div>
    </nav>
  );
}