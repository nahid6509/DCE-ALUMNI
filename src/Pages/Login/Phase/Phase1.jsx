import { useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../Providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const Phase1 = () => {
  const { createUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ mode: "onTouched" });

  const onSubmit = async (data) => {
    try {
      const image = data.photo[0];
      const formData = new FormData();
      formData.append("image", image);
  
      const res = await fetch("https://api.imgbb.com/1/upload?key=1f5e510e94b6202c5ee3be99fe20df4e", {
        method: "POST",
        body: formData
      });
  
      const imgData = await res.json();
  
      if (!imgData.success) {
        throw new Error("Image upload failed");
      }
  
      const photoURL = imgData.data.url;
  
      const user = {
        name: data.name,
        id: data.id,
        place: data.place,
        photoURL: photoURL
      };
  
      await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });
  
      navigate("/profile", { state: user });
    } catch (err) {
      console.error("Upload Error:", err.message);
      alert("Something went wrong! Check console or try another image.");
    }
  };
  

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="card-body">
            <fieldset className="space-y-4">
              <div>
                <label className="label">Name</label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="input input-bordered w-full"
                  placeholder="Your Name"
                />
                {errors.name && <span className="text-red-600 text-sm">{errors.name.message}</span>}
              </div>

              <div>
                <label className="label">ID</label>
                <input
                  type="number"
                  {...register("id", { required: "ID is required" })}
                  className="input input-bordered w-full"
                  placeholder="Your ID"
                />
                {errors.id && <span className="text-red-600 text-sm">{errors.id.message}</span>}
              </div>

              <div>
                <label className="label">Your Work Place Name</label>
                <input
                  type="text"
                  {...register("place", { required: "Place is required" })}
                  className="input input-bordered w-full"
                  placeholder="Your Work Place Name"
                />
                {errors.place && <span className="text-red-600 text-sm">{errors.place.message}</span>}
              </div>

              <div>
                <label className="label">Upload Photo</label>
                <input
                  type="file"
                  {...register("photo", { required: "Photo is required" })}
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                />
                {errors.photo && <span className="text-red-600 text-sm">{errors.photo.message}</span>}
              </div>

              <input type="submit" value="Submit" className="btn btn-neutral mt-4 w-full" />
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Phase1;
