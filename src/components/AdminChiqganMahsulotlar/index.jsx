import React from "react";
import { FaDownload } from "react-icons/fa6";

const AdminChiqganMahsulotlar = () => {
  return (
    <div>
      <div className="flex items-center justify-between p-4">
        <p className="text-xl font-semibold text-[#004269]">
          Chiqarilgan mahsulotlar
        </p>
        <label className="input input-bordered flex items-center gap-2">
          <input type="text" className="grow" placeholder="Search" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
      </div>
      <div className="p-4">
        {/* Items */}
        <div className="grid grid-cols-2 xl:grid-cols-3 border rounded p-2.5 bg-slate-50 mb-3">
          <div className="col-span-1 xl:col-span-2">Palonchiyev Pistonchi</div>
          <div className="col-span-1 flex items-center justify-between gap-7">
            <div>№1234567</div>
            <div>2024-11-08</div>
            <a href="/" className="xl:mr-5" download>
              <FaDownload />
            </a>
          </div>
        </div>
        {/* Items */}
        <div className="grid grid-cols-2 xl:grid-cols-3 border rounded p-2.5 bg-slate-50 mb-3">
          <div className="col-span-1 xl:col-span-2">Komendantov Komendant</div>
          <div className="col-span-1 flex items-center justify-between gap-7">
            <div>№1234566</div>
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

export default AdminChiqganMahsulotlar;
