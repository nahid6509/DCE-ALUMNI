import { useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../Providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const {createUser} = useContext(AuthContext);
  const navigate = useNavigate(); // Create the navigate function

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ mode: "onTouched" });

  const onSubmit = (data) => {
    console.log(data);
    createUser(data.email,data.password)
    .then(result =>{
      const loggedUser = result.user;
      console.log(loggedUser);
      navigate("/phase1");
    })
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="card-body">
            <fieldset className="space-y-4">

              {/* Email */}
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email"
                    }
                  })}
                  className="input input-bordered w-full"
                  placeholder="Email"
                />
                {errors.email && (
                  <span className="text-red-600 text-sm mt-1 block">
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="label">Password</label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
                  className="input input-bordered w-full"
                  placeholder="Password"
                />
                {errors.password && (
                  <span className="text-red-600 text-sm mt-1 block">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <input
                type="submit"
                value="Register"
                className="btn btn-neutral mt-4 w-full"
              />
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
