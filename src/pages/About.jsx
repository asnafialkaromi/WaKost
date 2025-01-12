import React, { useEffect } from "react";
import NavBar from "../components/common/NavBar";
import Footer from "../components/Footer";
import { Image } from "@nextui-org/react";
import AOS from "aos";

function About() {
  useEffect(() => {
    AOS.init({ duration: 500, easing: "ease-in-out" });
  }, []);
  return (
    <>
      <NavBar />
      <section>
        <div className="flex flex-col w-fit max-w-7xl h-fit mx-auto p-8 items-center">
          <h1
            className="text-xl md:text-4xl font-bold text-center mb-8"
            data-aos="fade-up"
          >
            Tentang Kami
          </h1>
          <div className="" data-aos="fade-up">
            <Image
              className="w-48 md:w-96 h-full"
              src="/images/logo_wakost.png"
              alt="Logo WaKost"
            />
          </div>
          <p
            className="text-sm md:text-lg text-center max-w-5xl mx-auto text-gray-600"
            data-aos="fade-up"
          >
            WaKost adalah website pencarian kost online yang membantu para
            mahasiswa dalam mencari kost yang sesuai dengan kebutuhan mereka.
            Dengan fitur-fitur yang lengkap, WaKost menyediakan informasi
            lengkap tentang kost, fasilitas, dan lokasi yang memudahkan pengguna
            dalam mencari kost yang sesuai dengan kebutuhan mereka.
          </p>
        </div>
      </section>
      <section className="max-w-full h-fit">
        <div className="w-fit max-w-7xl h-full flex flex-col md:flex-row items-center justify-center mx-auto py-14 px-4 gap-0">
          <div
            className="flex items-center justify-center w-full md:w-1/4 mb-8"
            data-aos="fade-up"
          >
            <Image
              isBlurred
              className="w-24 md:w-48 h-full"
              src="/icons/ic_interactive_map.png"
              alt="Location Map"
            />
          </div>
          <div className="flex flex-col w-full md:w-1/2" data-aos="fade-up">
            <h2 className="text-xl md:text-3xl font-bold text-center mb-4">
              Fitur Map
            </h2>
            <p className="text-sm md:text-lg text-gray-600 text-center w-full">
              Dengan fitur peta interaktif, pengguna dapat menjelajahi kost
              dengan mudah dan memilih kost yang sesuai dengan lokasi yang
              mereka inginkan. Fitur ini memudahkan pengguna dalam menemukan
              kost yang sesuai dengan kebutuhan mereka.
            </p>
          </div>
        </div>
      </section>
      <section className="max-w-full h-fit">
        <div className="max-w-7xl h-full flex flex-col md:flex-row items-center justify-center mx-auto py-14 px-4 gap-24">
          <div className="flex flex-col w-full md:w-1/2" data-aos="fade-up">
            <h2 className="text-xl md:text-3xl font-bold text-center mb-4">
              Informasi yang Detail
            </h2>
            <p className="text-sm md:text-lg text-gray-600 text-center">
              Website ini menyediakan informasi yang detail tentang kost,
              fasilitas, dan lokasi. Informasi ini membantu pengguna dalam
              memilih kost yang sesuai dengan kebutuhan mereka.
            </p>
          </div>
          <div
            className="flex items-center justify-center w-full md:w-1/4 mb-8"
            data-aos="fade-up"
          >
            <Image
              isBlurred
              className="w-24 md:w-48 h-full"
              src="/icons/ic_information_browser.png"
              alt="Location Map"
            />
          </div>
        </div>
      </section>
      <section className="max-w-full h-fit">
        <div className="max-w-7xl h-full flex flex-col md:flex-row items-center justify-center mx-auto py-14 px-4 gap-8">
          <div
            className="flex items-center justify-center w-full md:w-1/4 mb-8"
            data-aos="fade-up"
          >
            <Image
              isBlurred
              className="w-24 md:w-48 h-full"
              src="/icons/ic_search_browser.png"
              alt="Location Map"
            />
          </div>
          <div className="flex flex-col w-full md:w-1/2" data-aos="fade-up">
            <h2 className="text-xl md:text-3xl font-bold text-center mb-4">
              Fitur Pencarian
            </h2>
            <p className="text-sm md:text-lg text-gray-600 text-center">
              Dengan fitur pencarian yang lengkap, pengguna dapat mencari kost
              dengan mudah berdasarkan kriteria tertentu seperti jenis kost,
              harga, dan lokasi. Fitur ini memudahkan pengguna dalam menemukan
              kost yang sesuai dengan kebutuhan mereka.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default About;
