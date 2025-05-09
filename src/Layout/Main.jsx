import { Outlet, useLocation } from "react-router-dom";
import Footer from "../Sheared/Footer/Footer";
import Navbar from "../Sheared/NavBar/Navbar";

const Main = () => {
  const location = useLocation();
  console.log(location);
  const noHeaderFooter = location.pathname.includes('login') || location.pathname.includes('register') 
  return (
    <div>
      <Navbar />
      <div className="pt-24 px-4"> {/* This is the magic fix */}
        <Outlet />
      </div>
      {noHeaderFooter || <Footer />}
    </div>
  );
};

export default Main;
