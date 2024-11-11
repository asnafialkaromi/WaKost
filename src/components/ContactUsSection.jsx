import { Button, Input, Textarea } from "@nextui-org/react";
import React from "react";

function ContactUsSection() {
  return (
    <section className="max-w-full h-[60vh] bg-slate-200">
      <div className="max-w-5xl h-full flex flex-col md:flex-row items-center justify-center mx-auto py-8 md:py-16 px-4 gap-4 md:gap-20">
        {/* Title and Description */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Kontak Kami</h2>
          <p className="text-lg text-gray-600 mt-2">
            Mempunyai pertanyaan? kontak kami untuk lebih detail
          </p>
        </div>

        {/* Contact Form */}
        <form className="w-full max-w-md flex flex-col gap-6 ">
          <Input
            color="primary"
            variant="faded"
            labelPlacement="outside"
            type="text"
            label="Nama"
            placeholder="Enter your name"
          />
          <Input
            color="primary"
            variant="faded"
            labelPlacement="outside"
            type="email"
            label="Email"
            placeholder="Enter your email"
          />
          <Textarea
            color="primary"
            variant="faded"
            label="Your Message"
            labelPlacement="outside"
            placeholder="Enter your message"
          />
          <Button type="submit" color="primary" auto>
            Kirim Pesan
          </Button>
        </form>
      </div>
    </section>
  );
}

export default ContactUsSection;
