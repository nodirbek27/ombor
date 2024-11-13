import React from "react";
import { Link } from "react-router-dom";
import { FaDownload } from "react-icons/fa6";
// import APIArxiv from "../../services/arxiv";

const KomendantArxiv = () => {
  return (
    <div>
      <div className="breadcrumbs text-md ">
        <ul>
          <li>
            <Link to="/komendant">Ombor</Link>
          </li>
          <li>Arxiv</li>
        </ul>
      </div>
      <h2 className="text-xl xl:text-2xl text-center font-semibold my-4">
        Arxiv
      </h2>
      <div className="p-4">
        {/* Items */}
        <div className="grid grid-cols-2 xl:grid-cols-3 border rounded p-2.5 bg-slate-50 mb-3">
          <div className="col-span-1 xl:col-span-2">Buyurtma Id</div>
          <div className="col-span-1 flex items-center justify-between gap-7">
            <div>2024-11-08</div>
            <a href="/" className="xl:mr-5" download>
              <FaDownload />
            </a>
          </div>
        </div>
        {/* Items */}
        <div className="grid grid-cols-2 xl:grid-cols-3 border rounded p-2.5 bg-slate-50 mb-3">
          <div className="col-span-1 xl:col-span-2">Buyurtma Id</div>
          <div className="col-span-1 flex items-center justify-between gap-7">
            <div>2024-11-07</div>
            <a href="/" className="xl:mr-5" download>
              <FaDownload />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KomendantArxiv;
