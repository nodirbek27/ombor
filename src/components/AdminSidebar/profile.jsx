import React, { useEffect, useState } from "react";
import { ProfileContaier } from "./style";
import noImg from "../../assets/images/noUser.webp";
import APIUsers from "../../services/user";

export const Profile = () => {
  const [user, setUser] = useState([]);

  const getUserProfile = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const response = await APIUsers.get(); 
        const loggedInUser = response.data.find(
          (item) => item.id === parseInt(userId)
        );

        if (loggedInUser) {
          setUser(loggedInUser);
        } else {
          console.error("User not found");
        }
      }
    } catch (error) {
      console.error("Failed to fetch user profile", error);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <ProfileContaier>
      <ProfileContaier.Image src={noImg} />
      <div>
        <ProfileContaier.Name>{user.first_name} {user.last_name}</ProfileContaier.Name>
        <ProfileContaier.Email>{user.name}</ProfileContaier.Email>
      </div>
    </ProfileContaier>
  );
};
