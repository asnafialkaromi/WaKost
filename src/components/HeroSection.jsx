import React from "react";
import { Button, Image, Spacer } from "@nextui-org/react";

function HeroSection() {
  return (
    <section className="bg-[#eff4ff] max-w-full h-[70vh]">
      <div className="max-w-5xl h-full flex flex-col md:flex-row items-center justify-center mx-auto py-16 px-6 gap-8">
        {/* Left Side */}
        <div className="md:w-1/2 text-left flex flex-col gap-4">
          <h1 className="text-4xl font-bold text-gray-700">
            Cari Tempat Kost dengan Lebih
            <span className="text-primary"> Mudah</span>
          </h1>
          <p className="text-md text-gray-700">
            Temukan tempat tinggal sementara anda dengan mudah menggunakan
            website kami
          </p>
          <Button color="primary" className="font-semibold w-fit px-8">
            Cari Sekarang
          </Button>
        </div>

        {/* Right Side */}
        <div className="md:w-1/2 w-2/5">
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
