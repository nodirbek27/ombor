import React, { useEffect, useState } from "react";
import { Container, Section } from "./style";
import APIBuyurtma from "../../services/buyurtma";
import { IoNotificationsOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

export const AdminNavbar = () => {
  const [buyurtmalar, setBuyurtmalar] = useState([]);

  useEffect(() => {
    const getBuyurtmalar = async () => {
      try {
        const response = await APIBuyurtma.get();
        const filteredBuyurtmalar = response?.data?.filter(
          (item) =>
            item.sorov &&
            item.active &&
            item.prorektor &&
            item.bugalter &&
            (item.it_park || item.xojalik_bolimi) &&
            !item.omborchi
        );
        setBuyurtmalar(filteredBuyurtmalar);
      } catch (error) {
        console.error("Failed to fetch buyurtmalar or users", error);
      }
    };
    getBuyurtmalar();
  }, []);

  return (
    <Container>
      <Section>
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
