import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "../api/supabaseClient";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Chip,
  Image,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollShadow,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import formatToIDR from "../utils/currencyFormatter";
import CardList from "./ui/CardList";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function Map() {
  const [properties, setProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [maxDistance, setMaxDistance] = useState(0);
  const navigate = useNavigate();

  const fetchLocations = async () => {
    setIsLoading(true);
    let query = supabase.from("properties").select(`
      id, name, property_type, city, address, latitude, longitude, price, description, telp, distance,
      images (url)
    `);

    if (minPrice) {
      query = query.gte("price", minPrice);
    }

    if (maxPrice) {
      query = query.lte("price", maxPrice);
    }

    if (maxDistance) {
      query = query.lte("distance", maxDistance);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching properties:", error);
    } else {
      setProperties(data);
    }
    setIsLoading(false);
  };

  const handleFilter = () => {
    fetchLocations();
  };

  const handleMarkerClick = (id) => {
    navigate(`/kost/${id}`);
  };

  const handleSearch = async () => {
    setLoadingButton(true);
    try {
      const { data, error } = await supabase.from("properties").select(
        `
          id, name, city, address, price, description, property_type,
          images (url),
          property_facilities (facilities (name, facilities_type, icon_url))
        `
      );

      if (error) {
        console.error("Error fetching locations:", error);
      }

      const prompt = `
      Anda adalah seorang asisten AI. Saya akan memberikan data properti real estat, dan Anda harus:
1. Menganalisis properti yang cocok berdasarkan query saya: "${searchQuery}".
2. Berikan hasil dalam format JSON dengan struktur berikut:
   [
  {
    "id": "string",
    "name": "string",
    "city": "string",
    "address": "string",
    "price": number,
    "description": "string",
    "property_type": "string",
    "images": ["string"],
    "facilities": [
      {
        "name": "string",
        "facilities_type": "string",
        "icon_url": "string | null"
      }
    ]
  }
]

Data Properti:
${JSON.stringify(data)}

Pastikan hasil Anda hanya berupa JSON dan hanya untuk satu data properti yang paling relevan, tanpa penjelasan tambahan.
`;

      const generationConfig = {
        temperature: 0.7, // Untuk menghasilkan jawaban yang lebih konsisten
        topP: 0.9,
        topK: 50,
        maxOutputTokens: 1000, // Cukup untuk JSON yang relatif besar
        responseMimeType: "application/json",
      };

      const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

      const genAI = new GoogleGenerativeAI(`${GEMINI_API_KEY}`);

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const chatSession = model.startChat({
        generationConfig,
        history: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      });

      const result = await chatSession.sendMessage("Cek query berikut:");
      const jsonResponse = JSON.parse(result.response.text());
      setAnalysisResult(jsonResponse);
      setLoadingButton(false);
      onOpen();
    } catch (error) {
      console.error("Error in search or Gemini AI request:", error);
      setLoadingButton(false);
    }
  };

  const handelResetFilterPrice = () => {
    setMinPrice(0);
    setMaxPrice(0);
    fetchLocations();
  };

  const handelResetFilterDistance = () => {
    if (maxDistance > 0) {
      setMaxDistance(0);
    } else {
      fetchLocations();
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <>
      <Modal aria-labelledby="modal-title" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>
            <h3 className="text-lg font-bold">Hasil Analisis</h3>
          </ModalHeader>
          <ModalBody>
            {analysisResult.length > 0 ? (
              <>
                <Chip color="primary" variant="solid" size="md">
                  {analysisResult[0].property_type}
                </Chip>
                <p className="text-lg font-bold">{analysisResult[0].name}</p>

                <p>{analysisResult[0].city}</p>
                <p className="text-sm md:text-md">
                  {analysisResult[0].address}
                </p>

                <p className="font-bold text-blue-700">
                  {formatToIDR(analysisResult[0].price)} / bulan
                </p>
                <p className="text-sm md:text-md">
                  {analysisResult[0].description}
                </p>
              </>
            ) : (
              <p>Tidak ada hasil analisis.</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Tutup
            </Button>
            <Button
              color="primary"
              variant="solid"
              onPress={() => navigate(`/kost/${analysisResult[0].id}`)}
            >
              Lihat Detail
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div className="w-full flex flex-col md:flex-row">
        <div className="flex flex-col w-full h-full p-6 gap-4">
          <div className="flex top-32 justify-center w-full h-fit items-center gap-4 bg-white border-2 border-slate-200 shadow-sm rounded-lg p-2">
            <Tooltip
              placement="bottom"
              showArrow={true}
              content={
                <div className="px-1 py-2 w-52">
                  <div className="text-medium font-bold">
                    Panduan Penggunaan
                  </div>
                  <div className="text-small">
                    Cari tempat kos menggunakan AI dengan menggunakan kata kunci
                    yang tepat agar sesuai dengan kriteria yang anda inginkan
                  </div>
                  <Link size="sm" showAnchorIcon href="/guide">
                    Cek Panduan Penggunaan
                  </Link>
                </div>
              }
            >
              <Input
                type="text"
                variant="flat"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari tempat kos menggunakan bantuan AI ..."
                isRequired
                required
              />
            </Tooltip>

            <Tooltip
              placement="bottom"
              showArrow={true}
              content={
                <div className="px-1 py-2 w-52">
                  <div className="text-medium font-bold">
                    Panduan Penggunaan
                  </div>
                  <div className="text-small">
                    Cari tempat kos menggunakan AI dengan menggunakan kata kunci
                    yang tepat agar sesuai dengan kriteria yang anda inginkan.
                  </div>
                  <Link size="sm" showAnchorIcon href="/guide">
                    Cek Panduan Penggunaan
                  </Link>
                </div>
              }
            >
              <Link href="/guide">
                <Image
                  src="../../icons/ic_question.svg"
                  alt="search"
                  className="cursor-pointer"
                />
              </Link>
            </Tooltip>

            <Button
              className="bg-primary text-white font-semibold px-4 py-2 rounded-full"
              onPress={handleSearch}
              isLoading={loadingButton}
            >
              Cari
            </Button>
          </div>

          <div className="flex flex-row gap-2 w-full">
            <Popover showArrow offset={10} placement="bottom">
              <PopoverTrigger>
                <Button color="primary" variant="ghost">
                  Harga
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px]">
                {(titleProps) => (
                  <div className="px-1 py-2 w-full">
                    <p
                      className="text-small font-bold text-foreground"
                      {...titleProps}
                    >
                      Harga
                    </p>
                    <div className="mt-2 flex flex-row gap-2 w-full">
                      <Input
                        defaultValue="100000"
                        label="Terendah"
                        size="sm"
                        variant="bordered"
                        value={minPrice}
                        onChange={(e) => setMinPrice(Number(e.target.value))}
                        startContent={
                          <span className="text-default-400">Rp</span>
                        }
                      />
                      <Input
                        defaultValue="100000"
                        label="Tertinggi"
                        size="sm"
                        variant="bordered"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        startContent={
                          <span className="text-default-400">Rp</span>
                        }
                      />
                    </div>
                    <Button
                      color="primary"
                      size="sm"
                      variant="solid"
                      className="w-full mt-2"
                      onPress={handleFilter}
                    >
                      Simpan
                    </Button>
                    <Button
                      color="primary"
                      size="sm"
                      variant="light"
                      className="w-full mt-2"
                      onPress={handelResetFilterPrice}
                    >
                      Reset
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>

            <Popover showArrow offset={10} placement="bottom">
              <PopoverTrigger>
                <Button color="primary" variant="ghost">
                  Jarak
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px]">
                {(titleProps) => (
                  <div className="px-1 py-2 w-full">
                    <p
                      className="text-small font-bold text-foreground"
                      {...titleProps}
                    >
                      Jarak
                    </p>
                    <div className="mt-2 flex flex-row gap-2 w-full">
                      <Input
                        defaultValue="10"
                        label="Terjauh"
                        size="sm"
                        variant="bordered"
                        value={maxDistance}
                        onChange={(e) => setMaxDistance(Number(e.target.value))}
                        endContent={
                          <span className="text-default-400">Meter</span>
                        }
                      />
                    </div>
                    <Button
                      color="primary"
                      size="sm"
                      variant="solid"
                      className="w-full mt-2"
                      onPress={handleFilter}
                    >
                      Simpan
                    </Button>
                    <Button
                      color="primary"
                      size="sm"
                      variant="light"
                      className="w-full mt-2"
                      onPress={handelResetFilterDistance}
                    >
                      Reset
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>

          <ScrollShadow
            hideScrollBar
            className="flex flex-col w-full h-[70vh] p-2"
          >
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <p>Loading data...</p>
              </div>
            ) : properties.length > 0 ? (
              <div className="flex flex-col w-full h-fit gap-2">
                {properties.map((property) => (
                  <CardList
                    id={property.id}
                    key={property.id}
                    image={property.images[0]?.url}
                    type={property.property_type}
                    title={property.name}
                    price={property.price}
                    distance={property.distance}
                  />
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center h-full">
                <p>Tidak ada data yang ditemukan.</p>
              </div>
            )}
          </ScrollShadow>
        </div>
        <div className="h-full w-full z-0 hidden md:block">
          <MapContainer
            center={[-7.4000599, 109.2316062]}
            zoom={20}
            style={{ height: "94vh", width: "100%", zIndex: 0 }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {properties.map((properties) => (
              <Marker
                key={properties.id}
                position={[properties.latitude, properties.longitude]}
                eventHandlers={{
                  click: () => handleMarkerClick(location.id),
                }}
              />
            ))}
          </MapContainer>
        </div>
      </div>
    </>
  );
}

export default Map;
