import { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../Providers/AuthProvider';

const Navbar = () => {

  const {user,logOut} = useContext(AuthContext);
  const handleLOgOut =()=>{
          logOut()
          .then(()=>{})
          .catch(error=>console.log(error));
  }
  
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  let timer;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (menu) => {
    clearTimeout(timer); // Stop the hide timer
    setDropdown(menu);
  };

  const handleMouseLeave = () => {
    timer = setTimeout(() => {
      setDropdown(null);
    }, 300); // Add a small delay before hiding
  };

  return (
    <div
      className={`navbar fixed z-10 w-full shadow-sm transition-colors duration-300 ${
        scrolled ? "bg-red-500" : "bg-white bg-opacity-40"
      } text-black font-bold`}
    >
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl">DCE</a>
      </div>

      <div className="navbar-center">
        <ul className="flex space-x-6">
          {/* Home */}
          <li>
            <NavLink to="/" className="hover:text-red-500">Home</NavLink>
          </li>

          {/* About (hover dropdown) */}
          <li 
            className="relative"
            onMouseEnter={() => handleMouseEnter('about')}
            onMouseLeave={handleMouseLeave}
          >
            <div className="hover:text-red-500 cursor-pointer">About</div>
            {dropdown === 'about' && (
              <ul className="absolute left-0 mt-2 w-40 bg-white rounded shadow-lg z-50" onMouseEnter={() => handleMouseEnter('about')} onMouseLeave={handleMouseLeave}>
                <li><NavLink to="/about/DCEDepartmentAlumniConstitution" className="block px-4 py-2 hover:bg-gray-100">DCE Department Alumni Constitution</NavLink></li>
                <li><NavLink to="/about/Mission&Vision" className="block px-4 py-2 hover:bg-gray-100">Mission & Vision</NavLink></li>
              </ul>
            )}
          </li>

          {/* Alumni (hover dropdown) */}
          <li 
            className="relative"
            onMouseEnter={() => handleMouseEnter('alumni')}
            onMouseLeave={handleMouseLeave}
          >
            <div className="hover:text-red-500 cursor-pointer">DCE Alumni</div>
            {dropdown === 'alumni' && (
              <ul className="absolute left-0 mt-2 w-48 bg-white rounded shadow-lg z-50" onMouseEnter={() => handleMouseEnter('alumni')} onMouseLeave={handleMouseLeave}>
                <li><NavLink to="/alumni/HowtoRegister" className="block px-4 py-2 hover:bg-gray-100">How to Register</NavLink></li>
                <li><NavLink to="/alumni/AlumniRegistration" className="block px-4 py-2 hover:bg-gray-100">Alumni Registration</NavLink></li>
                <li><NavLink to="/alumni/AlumniMember" className="block px-4 py-2 hover:bg-gray-100">Alumni Member</NavLink></li>
                <li><NavLink to="/alumni/MemberUpgrade" className="block px-4 py-2 hover:bg-gray-100">Member Upgrade</NavLink></li>
              </ul>
            )}
          </li>

          {/* Committee (hover dropdown) */}
          <li 
            className="relative"
            onMouseEnter={() => handleMouseEnter('committee')}
            onMouseLeave={handleMouseLeave}
          >
            <div className="hover:text-red-500 cursor-pointer">Committee</div>
            {dropdown === 'committee' && (
              <ul className="absolute left-0 mt-2 w-40 bg-white rounded shadow-lg z-50" onMouseEnter={() => handleMouseEnter('committee')} onMouseLeave={handleMouseLeave}>
                <li><NavLink to="/committee/members" className="block px-4 py-2 hover:bg-gray-100">Members</NavLink></li>
              </ul>
            )}
          </li>

          {/* Past Event (hover dropdown) */}
          <li 
            className="relative"
            onMouseEnter={() => handleMouseEnter('past-event')}
            onMouseLeave={handleMouseLeave}
          >
            <div className="hover:text-red-500 cursor-pointer">Past Event</div>
            {dropdown === 'past-event' && (
              <ul className="absolute left-0 mt-2 w-48 bg-white rounded shadow-lg z-50" onMouseEnter={() => handleMouseEnter('past-event')} onMouseLeave={handleMouseLeave}>
                <li><NavLink to="/past-event/1stReunion" className="block px-4 py-2 hover:bg-gray-100">1st Reunion</NavLink></li>
              </ul>
            )}
          </li>
        </ul>
      </div>

      <div className="navbar-end">
        <NavLink to="register" className="btn" >Register</NavLink >
        {
          user ? <>
          <button onClick={handleLOgOut} className="btn btn-soft btn-default">Logout</button>
          </>:
          <><NavLink to="login"  className="btn">Login</NavLink >
          </>
        }
      </div>
    </div>
  );
};

export default Navbar;
