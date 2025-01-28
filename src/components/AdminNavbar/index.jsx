import React, { useEffect, useState } from "react";
import { Container, Section } from "./style";
import APIBuyurtma from "../../services/buyurtma";
import { IoNotificationsOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import CryptoJS from "crypto-js";
import Time from "./Time"

export const AdminNavbar = () => {
  const [buyurtmalar, setBuyurtmalar] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("data"));
    if (data) {
      const unShifredRole = CryptoJS.AES.decrypt(data?.role, "role-001")
        .toString(CryptoJS.enc.Utf8)
        .trim()
        .replace(/^"|"$/g, "");
      setRole(unShifredRole);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await APIBuyurtma.get();
        const filteredBuyurtmalar = response?.data?.filter(
          (item) => item.buyurtma_role === role
        );

        setBuyurtmalar(filteredBuyurtmalar);
      } catch (err) {
        setError("Talabnomalarni olishda xatolik yuz berdi!");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (role) {
      fetchData();
    }
  }, [role]);

  if (loading) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center">{error}</div>;
  }

  return (
    <Container>
      <Section>
        <Time />
        <Link to="/omborchi/so'rovlar" style={{ position: "relative" }}>
          <IoNotificationsOutline className="w-6 h-auto" />
          {buyurtmalar.length > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-5px",
                right: "-5px",
                background: "red",
                color: "white",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: "10px",
                fontWeight: "bold",
              }}
            >
              {buyurtmalar.length}
            </span>
          )}
        </Link>
      </Section>
    </Container>
  );
};

export default AdminNavbar;
