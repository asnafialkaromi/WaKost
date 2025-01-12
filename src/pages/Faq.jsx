import React, { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import { Accordion, AccordionItem, Skeleton } from "@nextui-org/react";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";

const Faq = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch FAQs from Supabase
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const { data, error } = await supabase.from("faqs").select("*");

        if (error) {
          console.error("Error fetching FAQs:", error);
        } else {
          setFaqs(data);
        }
      } catch (err) {
        console.error("Error fetching FAQs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  return (
    <>
      <NavBar />
      <div className="max-w-7xl h-[90vh] mx-auto px-2 md:px-8 mt-5">
        <h1 className="text-xl md:text-3xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h1>
        {loading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="w-full md:w-2/3 mx-auto h-14 rounded-lg p-0" />
            <Skeleton className="w-full md:w-2/3 mx-auto h-14 rounded-lg p-0" />
            <Skeleton className="w-full md:w-2/3 mx-auto h-14 rounded-lg p-0" />
            <Skeleton className="w-full md:w-2/3 mx-auto h-14 rounded-lg p-0" />
          </div>
        ) : (
          <Accordion variant="splitted">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                title={faq.question}
                className="w-full md:w-2/3 mx-auto text-sm md:text-md"
                aria-label="Faq Accordion Item"
              >
                <p>{faq.answer}</p>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Faq;
