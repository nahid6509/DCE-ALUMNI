import { useContext } from "react";
import { AuthContext } from "../../Providers/AuthProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";


const Login = () => {

  const {signIn} = useContext(AuthContext)
  const navigate = useNavigate();
const location = useLocation();
const from = location.state?.from?.pathname || "/"; // now works properly


  const handleLogin = event =>{
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;
    console.log(email,password);
    signIn(email,password)
    .then(result => {
      const user = result.user;
      console.log(user);
      navigate(from, { replace: true });

    })
  }
    return (
        <div className="hero bg-base-200 min-h-screen">
  <div className="hero-content flex-col lg:flex-row-reverse">

    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <form onSubmit={handleLogin} className="card-body">
        <fieldset className="fieldset">
          <label className="label">Email</label>
          <input type="email" name="email" className="input" placeholder="Email" />
          <label className="label">Password</label>
          <input type="password" name="password" className="input" placeholder="Password" />
          <div><a className="link link-hover">Forgot password?</a></div>
          <input className="btn btn-neutral mt-4" type="submit" value="Login" />
        </fieldset>
      </form>
      <p><small>New Here?<Link to="/register">Create an account</Link></small></p>
    </div>
  </div>
</div>
    );
};

export default Login;