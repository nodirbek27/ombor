// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";
import "./style.css";
import React, { useEffect, useState } from "react";
import APIBuyurtma from "../../services/buyurtma";
import APIMahsulot from "../../services/mahsulot";
import APIBirlik from "../../services/birlik";
import APIArxiv from "../../services/arxiv";
import APIUsers from "../../services/user";

function Pdf() {
  const [loader, setLoader] = useState(false);

  const downloadPDF = () => {
    const element = document.querySelector(".actual-receipt");
    setLoader(true);
    const options = {
      margin: 0.5,
      filename: "shartnoma.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf()
      .from(element)
      .set(options)
      .save()
      .finally(() => setLoader(false));
  };

  const [savat, setSavat] = useState([]);
  const [buyurtmalar, setBuyurtmalar] = useState([]);
  const [mahsulot, setMahsulot] = useState([]);
  const [birlik, setBirlik] = useState([]);
  const [users, setUsers] = useState({});

  useEffect(() => {
    const getBuyurtmalar = async () => {
      try {
        const response = await APIBuyurtma.get();
        const filteredBuyurtmalar = response?.data?.filter(
          (item) => item.sorov && item.active
        );
        setBuyurtmalar(filteredBuyurtmalar);

        // Fetch user data for each buyurtma
        const userPromises = filteredBuyurtmalar.map((buyurtma) =>
          APIUsers.getbyId(`/${buyurtma.user}`).then((response) => {
            const user = response?.data;
            return {
              [buyurtma.user]: `${user?.first_name || "Noma'lum"} ${
                user?.last_name || ""
              }`.trim(),
            };
          })
        );
        const usersData = await Promise.all(userPromises);
        setUsers(Object.assign({}, ...usersData));
      } catch (error) {
        console.error("Failed to fetch buyurtmalar or users", error);
      }
    };
    getBuyurtmalar();
  }, []);

  useEffect(() => {
    const getSavat = async () => {
      try {
        if (buyurtmalar.length > 0) {
          const response = await APIArxiv.get();
          const filteredSavat = response?.data?.filter((item) =>
            buyurtmalar.some((buyurtma) => item.buyurtma === buyurtma.id)
          );
          setSavat(filteredSavat);
        }
      } catch (error) {
        console.error("Failed to fetch savat", error);
      }
    };
    getSavat();
  }, [buyurtmalar]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mahsulotData, birlikData] = await Promise.all([
          APIMahsulot.get(),
          APIBirlik.get(),
        ]);
        setMahsulot(mahsulotData?.data);
        setBirlik(birlikData?.data);
      } catch (error) {
        console.error("Failed to fetch mahsulot or birlik", error);
      }
    };
    fetchData();
  }, []);

  const getMahsulotName = (id) =>
    mahsulot.find((item) => item.id === id)?.name || "Noma'lum";
  const getBirlikName = (id) =>
    birlik.find((item) => item.id === id)?.name || "Noma'lum";

  return (
    <div className="wrapper">
      <div className="receipt-box">
        {/* actual receipt */}
        <div className="actual-receipt">
          {/* organization name */}
          <h4>
            O'ZBEKISTON RESPUBLIKASI OLIY TA'LIM, FAN VA INNOVATSIYALAR
            VAZIRLIGI YOSH MUTAXASSISNI MALAKA AMALIYOTINI O'TASH VA KELGUSIDA
            ISH BILAN TA'MINLASHGA KO'MAKLASHISH TO'G'RISIDA
          </h4>

          {/* contract number */}
          <h6>SHARTNOMA 12888</h6>

          {/* sana */}
          <p className="sana">2-Avgust, 2024-yil 10:03</p>

          {/* email-phone-and-website */}
          <div className="contract-info">
            <p>
              <span className="abzas">O'zbekiston</span> Respublikasi
              Prezidentining 2017-yil 27-iyuldagi PQ-3151-sonli, 2018-yil
              5-iyundagi PQ-3775-sonli, 2021-yil 24-dekabrdagi PQ-60-son
              qarorlari va O'zbekiston Respublikasi Prezidenti
              Administratsiyasining 2022-yil 15-martdagi 04-593-sonli
              topshiriqlari ijrosi yuzasidan O'zbekiston Respublikasi Oliy
              ta’lim, fan va innovatsiyalar vazirligining 2022-yil 13-iyundagi
              202-sonli buyrug'i asosida ishlab chiqilgan va tasdiqlangan Oliy
              ta'lim muassasalari talabalarining malaka amaliyotini o'tash
              tartibi to'g'risidagi namunaviy Nizomga asosan bitiruvchilarni
              malaka amaliyotini o'tkazish va ularni kelgusidagi ishga
              joylashishiga ko'maklashish maqsadida Qo'qon davlat pedagogika
              instituti (keyingi o'rinlarda “QDPI” deb yuritiladi) nomidan
              ta'lim muassasasi Ustavi hamda Talabalarining malaka amaliyotini
              o'tash tartibi to'g'risidagi Nizomiga asoslanib ish yurituvchi
              rektor Xodjayeva Dilnoza Shavkatovna bir tomondan, ish beruvchi
              Ustaviga asoslanib 54-umumiy o`rta ta`lim maktabi nomidan Mirzayev
              Nodirjon Hasanovich ikkinchi tomondan, (keyingi o'rinlarda “Qabul
              qiluvchi muassasa” deb yuritiladi) va oliy ta'lim muassasasi
              Boshlang'ich ta'lim fakulteti Boshlang'ich ta'lim ta'lim
              yo'nalishi talabasi Gulsanamxon O`rinboyeva Usubjon qizi (keyingi
              o'rinlarda “Amaliyotchi-talaba” deb yuritiladi) uchinchi tomondan
              ushbu shartnomani quyidagilar haqida tuzdilar.
            </p>

            <h5>1. SHARTNOMANING PREDMETI</h5>
            <p>
              <span className="abzas">O'zbekiston</span> Respublikasi Oliy
              ta’lim, fan va innovatsiyalar vazirligining 2022 yil 13-iyundagi
              “Oliy ta'lim muassasalari talabalarining malaka amaliyotini o'tash
              tartibini takomillashtirish to'g'risida”gi 202-sonli buyrug'i
              ijrosini ta'minlash maqsadida amalyotchi-talabani malaka
              amaliyotini o'tashi, oliy ma'lumotga ega bo'lgan yosh mutaxassis
              (bakalavr)larning intellektual salohiyatidan unumli foydalanish va
              ularni ish bilan ta'minlashga ko'maklashish.
            </p>
          </div>
        </div>

        {/* shartnoma action */}
        <div className="receipt-actions-div">
          <div className="actions-right">
            <button
              className="receipt-modal-download-button"
              onClick={downloadPDF}
              disabled={!(loader === false)}
            >
              {loader ? (
                <span>Yuklab olinyapti ...</span>
              ) : (
                <span>Yuklab olish</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pdf;
