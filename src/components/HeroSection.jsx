import React, { useEffect } from "react";
import { Button, Image, Link } from "@nextui-org/react";
import AOS from "aos";
import "aos/dist/aos.css";

function HeroSection() {
  useEffect(() => {
    AOS.init({ duration: 500, easing: "ease-in-out" });
  }, []);

  return (
    <section className="bg-[#eff4ff] max-w-full h-fit">
      <div className="max-w-7xl h-full flex flex-col md:flex-row items-center justify-center mx-auto py-16 px-6 gap-8">
        {/* Left Side */}
        <div
          className="md:w-1/2 text-left flex flex-col gap-4"
          data-aos="fade-up"
        >
          <h1 className="text-2xl md:text-4xl font-bold text-gray-700">
            Cari Tempat Kost dengan Lebih
            <span className="text-primary"> Mudah</span>
          </h1>
          <p className="text-sm md:text-md text-gray-700">
            Temukan tempat tinggal sementara anda dengan mudah menggunakan
            website kami
          </p>
          <Button
            as={Link}
            href="/kost"
            color="primary"
            className="font-semibold w-32 md:w-fit px-8"
          >
            Cari Sekarang
          </Button>
        </div>

        {/* Right Side */}
        <div className="md:w-1/3 w-[80%]" data-aos="fade-up">
          <Image
            isBlurred
            src="/images/img_3d_house.png"
            alt="3D House Illustration"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
