import React from "react";
import { NavLink } from "react-router-dom";
import chemLogo from "../assets/chem.png";

const Navbar = () => {
  const NavLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-blue-500 font-bold"
              : "text-gray-700 hover:text-blue-500"
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/train"
          className={({ isActive }) =>
            isActive
              ? "text-blue-500 font-bold"
              : "text-gray-700 hover:text-blue-500"
          }
        >
          Train
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/test"
          className={({ isActive }) =>
            isActive
              ? "text-blue-500 font-bold"
              : "text-gray-700 hover:text-blue-500"
          }
        >
          Test
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="w-full bg-white shadow-md">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="navbar">
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden hover:bg-blue-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow-lg"
              >
                {NavLinks}
              </ul>
            </div>
            <div className="flex items-center gap-2">
              <img src={chemLogo} alt="Chemistry Logo" className="h-8" />
            </div>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 gap-4">{NavLinks}</ul>
          </div>
          <div className="navbar-end">
            <button className="btn bg-blue-500 hover:bg-blue-600 text-white border-none">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
