import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import APITalabnoma from "../../services/talabnoma";

const Talabnomalar = () => {
  const { pk } = useParams();

  useEffect(() => {
    const fetchTalabnoma = async () => {
      try {
        // Make the API call
        const response = await APITalabnoma.get(`/${pk}`);
        const pdfUrl = response?.data?.talabnoma_pdf;

        if (pdfUrl) {
          // Open the PDF in a new tab
          window.open(pdfUrl, "_blank");
        } else {
          console.error("PDF URL not found in response.");
        }
      } catch (error) {
        console.error("Error fetching Talabnoma:", error);
      }
    };

    fetchTalabnoma();
  }, [pk]);

  return (
    <div>
      <p>PK: {pk}</p>
    </div>
  );
};

export default Talabnomalar;
