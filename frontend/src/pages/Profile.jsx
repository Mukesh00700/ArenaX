import { useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";  
function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
        const token = localStorage.getItem("token");
        console.log(token);
        if(!token) return;
        const decode = jwt_decode(token);
        console.log(decode);
        const userId = decode._id;
        const res = await axios.get(`http://localhost:3000/profile/myProfile/${userId}`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        setProfile(res.data);
    };
    fetchProfile();
  }, []);
    if (!profile) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-2xl">Loading...</p>
        </div>
        );
    }
    console.log("progile from Profile.jsx",profile.user);
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-white p-6 shadow rounded-lg flex gap-6 items-center">
        <img
          src={profile.user.imageUrl}
          alt="profile"
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">@{profile.user.username}</h1>
          <p className="text-gray-500">{profile.user.firstname+" "+profile.user.lastname}</p>
          <div className="flex gap-4 mt-2 text-sm text-gray-500">
            {/* <span>🏸 Matches: {profile.stats.matches}</span> */}
            <span>✅ Wins: {profile.totalWins}</span>
            <span>⭐ Rank: {profile.rank}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
