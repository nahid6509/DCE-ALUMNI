import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [newName, setNewName] = useState("");
  const [newPlace, setNewPlace] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (currentUser) {
          setUser(currentUser);
          setNewName(currentUser.name);
          setNewPlace(currentUser.place);
        } else {
          // **Important Change:** Don't redirect here.  Instead, set user to null
          setUser(null);
          console.warn("No user found in localStorage.");
          //  navigate("/register"); //  Remove this line
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        navigate("/error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdate = async () => {
    if (!newName || !newPlace) {
      alert("Please fill all fields.");
      return;
    }

    const updatedUser = {
      ...user,
      name: newName,
      place: newPlace,
    };

    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Update failed");
      }

      const updatedData = await response.json();
      setUser(updatedData);
      localStorage.setItem("user", JSON.stringify(updatedData));
      alert("User updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Update Error:", error);
      alert(error.message || "Update failed. Please try again!");
    }
  };

  const handleGoToRegister = () => {
    navigate("/register");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">
          User profile not found.
          <button
            onClick={handleGoToRegister}
            className="ml-2 text-blue-500 hover:text-blue-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Go to Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">User Profile</h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">ID:</label>
        <p className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          {user.id}
        </p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Place:</label>
        <input
          type="text"
          value={newPlace}
          onChange={(e) => setNewPlace(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Photo:</label>
        <img
          src={user.photoURL}
          alt="Profile"
          className="rounded h-32 w-32 object-cover"
        />
      </div>
      <button
        onClick={handleUpdate}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Update Profile
      </button>
    </div>
  );
};

export default Profile;

