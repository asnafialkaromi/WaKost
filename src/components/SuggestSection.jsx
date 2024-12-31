import { Image } from "@nextui-org/react";
import React from "react";

function SuggestSection() {
  return (
    <section className="max-w-full h-[60vh]">
      <div className="max-w-7xl h-full flex flex-col md:flex-row items-center justify-center mx-auto py-14 px-4 gap-20">
        {/* Left Side */}
        <div className="md:w-1/2 w-3/6">
          <Image
            isBlurred
            src="/images/img_location_phone.png"
            alt="Location Phone"
          />
        </div>

        {/* Right Side */}
        <div className="md:w-1/2 text-left flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-[#303a42] text-center">
            Ayo Cari Tempat Kost yang Cocok dengak Kriteria Anda
          </h1>
          <p className="text-md text-[#303a42] text-center">
            Cari tempat kost dengan fasilitas yang anda inginkan
          </p>
        </div>
      </div>
    </section>
  );
}

export default SuggestSection;
