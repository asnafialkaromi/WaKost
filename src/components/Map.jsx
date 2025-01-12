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
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import formatToIDR from "../utils/currencyFormatter";

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
  const [locations, setLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [analysisResult, setAnalysisResult] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocations = async () => {
      const { data, error } = await supabase.from("properties").select("*");
      if (error) console.error("Error fetching locations:", error);
      else setLocations(data);
    };

    fetchLocations();
  }, []);

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
      <div className="flex absolute top-20 left-1/2 transform -translate-x-1/2 justify-center w-[70%] md:w-[60%] h-fit items-center gap-4 z-20 bg-white rounded-lg p-2">
        <Input
          type="text"
          variant="flat"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari tempat kos ..."
          isRequired
          required
        />
        <Button
          className="bg-primary text-white font-semibold px-4 py-2 rounded-full"
          onPress={handleSearch}
          isLoading={loadingButton}
        >
          Cari
        </Button>
      </div>
      <div className="w-full relative z-0">
        <MapContainer
          center={[-7.4000599, 109.2316062]}
          zoom={20}
          style={{ height: "86vh", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {locations.map((location) => (
            <Marker
              key={location.id}
              position={[location.latitude, location.longitude]}
              eventHandlers={{
                click: () => handleMarkerClick(location.id),
              }}
            />
          ))}
        </MapContainer>
      </div>
    </>
  );
}

export default Map;
