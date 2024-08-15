"use client";
import { motion } from "framer-motion";

export default function Line() {
  return (
    <motion.div
      initial={{ width: "0%" }}
      whileInView={{ width: "100%" }}
      transition={{
        duration: 0.9,
      }}
      className="block h-3 bg-pointyellow"
    ></motion.div>
  );
}
