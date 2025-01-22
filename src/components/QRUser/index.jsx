import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import APIUsers from "../../services/user";

const QRUser = () => {
  const { pk } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // QRUserni olish
        const response = await APIUsers.getUser(pk);

        // Buyurtmaga mos talabnomani topish
        const user = response?.data;

        if (!user) {
          console.error("User topilmadi.");
          return;
        }

        const pdfUrl = user.talabnoma_pdf;

        if (pdfUrl) {
          // Foydalanuvchini PDF URL ga yo'naltirish
            window.location.href = pdfUrl;
        } else {
          console.error("PDF URL topilmadi.");
        }
      } catch (error) {
        console.error("Talabnomani olishda xato:", error);
      }
    };

    fetchUser();
  }, [pk]);

  return (
    <div>
      <p>User ma'lumotlarini yuklash...</p>
    </div>
  );
};

export default QRUser;
