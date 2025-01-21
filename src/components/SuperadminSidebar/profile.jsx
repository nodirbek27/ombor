import React, { useEffect, useState } from "react";
import { ProfileContaier } from "./style";
import noImg from "../../assets/images/noUser.webp";
import CryptoJS from "crypto-js";

export const Profile = () => {
   const [name, setName] = useState([]);
    const [lastName, setLastName] = useState([]);
  
    useEffect(() => {
      const data = JSON.parse(localStorage.getItem("data"));
      if (data) {
        const unShifredName = CryptoJS.AES.decrypt(
          data?.first_name,
          "first_name-001"
        )
          .toString(CryptoJS.enc.Utf8)
          .trim()
          .replace(/^"|"$/g, "");
        setName(unShifredName);
  
        const unShifredLastName = CryptoJS.AES.decrypt(
          data?.last_name,
          "last_name-001"
        )
          .toString(CryptoJS.enc.Utf8)
          .trim()
          .replace(/^"|"$/g, "");
        setLastName(unShifredLastName);
      }
    }, []);

  return (
    <ProfileContaier>
      <ProfileContaier.Image src={noImg} />
      <div>
        <ProfileContaier.Name>{name}</ProfileContaier.Name>
        <ProfileContaier.Name>{lastName}</ProfileContaier.Name>
      </div>
    </ProfileContaier>
  );
};
