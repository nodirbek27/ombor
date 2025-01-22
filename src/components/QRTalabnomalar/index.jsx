import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import APITalabnoma from "../../services/talabnoma";

const QRTalabnomalar = () => {
  const { pk } = useParams();

  useEffect(() => {
    const fetchTalabnoma = async () => {
      try {
        // QRTalabnomalarni olish
        const response = await APITalabnoma.getByOrder(pk);

        // Buyurtmaga mos talabnomani topish
        const talabnoma = response?.data

        if (!talabnoma) {
          console.error("Talabnoma topilmadi.");
          return;
        }

        const pdfUrl = talabnoma.talabnoma_pdf;

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

    fetchTalabnoma();
  }, [pk]);

  return (
    <div>
      <p>Talabnoma ma'lumotlarini yuklash...</p>
    </div>
  );
};

export default QRTalabnomalar;
