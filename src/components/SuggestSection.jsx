import { Image } from "@nextui-org/react";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function SuggestSection() {
  useEffect(() => {
    AOS.init({ duration: 500, easing: "ease-in-out" });
  }, []);

  return (
    <section className="max-w-full h-fit">
      <div className="max-w-7xl h-full flex flex-col md:flex-row items-center justify-center mx-auto py-14 px-4 gap-20">
        {/* Left Side */}
        <div className="md:w-1/3 w-[80%]" data-aos="fade-right">
          <Image
            isBlurred
            src="/images/img_location_phone.png"
            alt="Location Phone"
          />
        </div>

        {/* Right Side */}
        <div
          className="md:w-1/2 text-left flex flex-col gap-4"
          data-aos="fade-left"
        >
          <h1 className="text-xl md:text-3xl font-bold text-[#303a42] text-center">
            Ayo Cari Tempat Kost yang <br /> Cocok dengan Anda
          </h1>
          <p className="text-sm md:text-md text-[#303a42] text-center">
            Cari tempat kost dengan fasilitas terbaik dan kriteria yang anda
            inginkan dengan mudah dengan menggunakan website kami
          </p>
        </div>
      </div>
    </section>
  );
}

export default SuggestSection;
