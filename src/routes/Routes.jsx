import {
    createBrowserRouter,
  } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../Pages/Home/Home";
import About from "../Pages/About/About";
import Alumni from "../Pages/Alumni/Alumni";
import Committee from "../Pages/Committee/Committee";
import PastEvent from "../Pages/PastEvent/PastEvent";
import DceDept from "../Pages/About/DceDept";
import Mission from "../Pages/About/Mission";
import HowToRegister from "../Pages/Alumni/HowToRegister";
import AlumniREgister from "../Pages/Alumni/AlumniREgister";
import AlumniMember from "../Pages/Alumni/AlumniMember";
import MemberUpgrade from "../Pages/Alumni/MemberUpgrade";
import Members from "../Pages/Members/Members";
import Reunion from "../Pages/PastEvent/Reunion";
import Register from "../Pages/Login/Register";
import Login from "../Pages/Login/Login";
import PrivateRoute from "./PrivateRoute";
import Secret from "../Sheared/NavBar/Secret/Secret";
import Phase1 from "../Pages/Login/Phase/Phase1";
import Profile from "../Profile/Profile";


  export const router = createBrowserRouter([
    {
      path: "/",
      element:<Main></Main>,
      children:[
        {
            path:"/",
            element:<Home></Home>

        },
        {
           path:'/about',
           element:<About></About>
        },
        {
           path:'/alumni',
           element:<Alumni></Alumni>
        },
        {
           path:'/committee',
           element:<Committee></Committee>
        },
        {
           path:'/pastEvent',
           element:<PastEvent></PastEvent>
        },
        {
           path:"/about/Mission&Vision",
           element:<Mission></Mission>
        },
        {
           path:"/about/DCEDepartmentAlumniConstitution",
           element:<DceDept></DceDept>
        },
        {
           path:"/alumni/HowtoRegister",
           element:<HowToRegister></HowToRegister>
        },
        {
           path:"/alumni/AlumniRegistration",
           element:<AlumniREgister></AlumniREgister>
        },
        
        {
           path:"/alumni/MemberUpgrade",
           element:<MemberUpgrade></MemberUpgrade>
        },
        {
           path:"/committee/members",
           element:<Members></Members>
        },
        {
           path:"/past-event/1stReunion",
           element:<Reunion></Reunion>
        },
        {
           path:"/register",
           element:<Register></Register>
        },
        {
           path:"/login",
           element:<Login></Login>
        },

      //   Private Routes.......
      
        {
           path:"/alumni/AlumniMember",
           element:<PrivateRoute><AlumniMember></AlumniMember></PrivateRoute>
        },
        {
           path:"/phase1",
           element:<PrivateRoute><Phase1></Phase1></PrivateRoute>
        },
        {
           path:"/profile",
           element:<PrivateRoute><Profile></Profile></PrivateRoute>
        },
      ]
    },
  ]);