import React from "react";
import NavBar from "../components/common/NavBar";
import Footer from "../components/Footer";
import { Image } from "@nextui-org/react";

function Guide() {
  return (
    <>
      <NavBar />
      <div className="max-w-7xl h-fit mx-auto px-2 md:px-8 mt-5">
        <h1 className="text-xl md:text-3xl font-bold text-center mb-8">
          Panduan Penggunaan Website WaKost
        </h1>
        <section className="my-14 p-4">
          <h2 className="text-lg md:text-2xl font-bold text-center mb-8">
            Tampilan Rekomendasi
          </h2>
          <p className="text-sm md:text-lg text-center max-w-5xl mx-auto text-gray-600">
            Di halaman utama website WaKost, Anda dapat melihat rekomendasi kos
            berdasarkan kriteria yang telah ditentukan oleh sistem. Rekomendasi
            ini membantu Anda dalam mencari kost yang sesuai dengan kebutuhan.
            Selain itu, anda juga dapat melihat detail dari masing-masing
            rekomendasi yang ditampilkan
          </p>
          <Image
            isBlurred
            src="../../images/img_landing-page.png"
            alt="image"
            className="w-[60%] sm:w-[40%] mx-auto mt-10 aspect-video"
          />
        </section>

        <section className="my-14 p-4">
          <h2 className="text-lg md:text-2xl font-bold text-center mb-8">
            Halaman Peta
          </h2>
          <p className="text-sm md:text-lg text-center max-w-5xl mx-auto text-gray-600">
            Di halaman peta, Anda dapat menjelajahi kost dengan peta yang
            interaktif. Anda dapat melihat informasi tentang kost, fasilitas,
            dan lokasi yang memudahkan Anda dalam mencari kost yang sesuai
            dengan kebutuhan pada bagian sisi kiri atau menelusuri menggunakan
            peta. Selain itu, Anda juga dapat melihat detail dari masing-masing
            kost yang ditampilkan.
          </p>
          <Image
            isBlurred
            src="../../images/img_map-page.png"
            alt="image"
            className="w-[60%] sm:w-[40%] mx-auto my-10 aspect-video"
          />

          <h3 className="text-md md:text-lg font-bold text-center mx-auto mb-4 text-gray-600">
            Lakukan pencarian dengan kata kunci yang efektif.
          </h3>
          <div className="flex items-center justify-center w-full">
            <Image
              isBlurred
              src="../../images/img_search-box.png"
              alt="image"
              className="w-full sm:w-[40%] mx-auto my-10"
            />
          </div>

          <p className="text-sm md:text-lg text-center max-w-5xl mx-auto text-gray-600">
            Untuk melakukan pencarian dengan kata kunci yang efektif, Anda dapat
            menggunakan kata kunci yang relevan dan sesuai dengan kriteria
            pencarian Anda. Misalnya, jika Anda mencari kost dengan fasilitas
            kamar mandi, Anda dapat menggunakan kata kunci seperti "kamar mandi"
            atau "fasilitas kamar mandi". Sedangkan untuk mencari kost dengan
            harga tertentu, anda dapat menggunakan kata kunci dengan menentukan
            harga yang anda inginkan seperti "harga 500 ribu" atau "harga per
            bulan". Setelah itu, Anda dapat melihat rekomendasi kost yang sesuai
            dengan kata kunci pencarian Anda.
          </p>
          <Image
            isBlurred
            src="../../images/img_result-search.png"
            alt="image"
            className="w-[60%] sm:w-[40%] mx-auto my-10"
          />
        </section>
      </div>
      <Footer />
    </>
  );
}

export default Guide;
