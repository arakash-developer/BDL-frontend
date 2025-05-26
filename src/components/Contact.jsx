import { Image } from "antd";
import axios from "axios";
import React, { useState } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    url: "",
    visitingCard: null,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      visitingCard: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(false);

    // Prepare form data to send (including file upload)
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phoneNumber", formData.phoneNumber);
    data.append("url", formData.url);
    data.append("visitingCard", formData.visitingCard);
    data.append("message", formData.message);

    for (const [key, value] of data.entries()) {
      console.log(key, value);
    }

    try {
      // config object for axios post request
      // onUploadProgress: callback function that is called when the upload progress changes
      // this function receives the progress event as an argument
      // the progress event contains the loaded and total properties
      // by using these properties we can calculate the percentage of the upload
      // and update the state with the new percentage
      const config = {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percent = Math.floor((loaded * 100) / total);
          setUploadProgress(percent);
        },
      };
      // Sending the POST request to the API
      const response = await axios.post(
        "https://code.bdluminaries.com/api/v1/contacts",
        data,
        config
      );

      if (response.status === 201) {
        setSuccess(true);
        setFormData({
          name: "",
          email: "",
          phoneNumber: "",
          url: "",
          visitingCard: null,
          message: "",
        });
      }
    } catch (err) {
      console.error("Error submitting the form:", err);
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="sticky top-0 z-[999]">
        <Navbar />
      </div>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-3 pb-12 mt-0">
        <div className="text-2xl mb-6 text-center relative">
          <p className="text-[#686868] font-bold text-xl uppercase">
            Make an appointment
          </p>
          <span className="Contactwith absolute text-lg left-0 top-7 -rotate-45 text-[#F15B26]">
            with
          </span>
          <span className="font-bdlHeading font-bold text-sm tracking-tight text-[#8AC249]">bdLUMINARIES</span>
        </div>

        {success && (
          <p className="text-green-500 mb-4">Form submitted successfully!</p>
        )}
        {error && (
          <p className="text-red-500 mb-4">
            There was an error submitting the form.
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className=" shadow-lg rounded-lg p-4 max-w-lg w-full mx-auto text-[#272727]"
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name *"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow dark:bg-white"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address *"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow dark:bg-white"
            required
          />

          <input
            type="tel"
            name="phoneNumber"
            placeholder="WhatsApp Number *"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow dark:bg-white"
            required
          />

          <input
            type="text"
            name="url"
            placeholder="Website URL (Optional)"
            value={formData.url}
            onChange={handleChange}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow dark:bg-white"
          />

          {formData.visitingCard && (
            <div className="mb-4 w-full overflow-hidden h-[180px]">
              <Image
                className="w-full h-full object-cover"
                src={URL.createObjectURL(formData.visitingCard)}
                alt="Uploaded visiting card"
                width={"100%"}
                height={180}
              />
            </div>
          )}

          <label
            htmlFor="file"
            className="block w-full p-3 mb-4 border border-gray-300 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all relative focus:ring-2 focus:ring-green-500"
          >
            <input
              type="file"
              id="file"
              name="visitingCard"
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer dark:bg-white"
              onChange={handleFileChange}
              required
            />
            <p className="text-gray-500 text-center">
              Upload Your Visiting Card *
            </p>
          </label>

          <textarea
            name="message"
            placeholder="Your Message *"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow dark:bg-white"
            rows="4"
            required
          ></textarea>

          <button
            type="submit"
            className={`w-full font-bdlHeading py-3 bg-green-600 text-white font-semibold rounded-lg transition-all hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? `${uploadProgress}% Sending...` : "Send"}
          </button>
        </form>

        <div className="w-full my-3">
          <iframe
            className="w-full"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d228.13110424821457!2d90.41109242704812!3d23.81512576088967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c767e22e05c1%3A0xf7911921fd9bc594!2sKing%20Ru%24%24%20Residential%20Complex!5e0!3m2!1sen!2sbd!4v1717258321890!5m2!1sen!2sbd"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <footer className="bg-gray-200 p-4 rounded-lg shadow-lg w-full max-w-md mt-4">
          <p className="text-gray-700 mb-1 text-xs">
            <strong>Address:</strong> Baridhara DOHS house 122/3
          </p>
          <p className="text-gray-700 mb-1 text-xs">
            <strong>Phone:</strong> (123) 456-7890
          </p>
          <p className="text-gray-700 mb-1 text-xs">
            <strong>Email:</strong> info@bdluminaries.com
          </p>
          <p className="text-gray-700 mb-1 text-xs">
            <strong>Hours:</strong> Mon - Sat: 8:00 am to 6:00 pm | Sunday:
            CLOSED
          </p>
        </footer>
      </div>
      <Footer />
    </>
  );
};

export default ContactForm;
