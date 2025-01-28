import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BsTwitter } from "react-icons/bs";

const LoadingPage = () => {
  const [dots, setDots] = useState("...");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return ".";
        if (prev === ".") return "..";
        return "...";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen text-white">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="text-blue-500 text-6xl mb-4"
      >
        <BsTwitter />
      </motion.div>
      <motion.h1
        className="text-2xl font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
      >
        Loading{dots}
      </motion.h1>
    </div>
  );
};

export default LoadingPage;
