"use client";
import { motion } from "framer-motion";

type TextAnimationProp = {
  inputText: string;
};

export default function TextAnimation({ inputText }: TextAnimationProp) {
  const text = inputText.split("");

  return (
    <>
      {text.map((el, i) => (
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{
            duration: 0.25,
            delay: i / 10,
          }}
          key={i}
        >
          {el}
        </motion.span>
      ))}
    </>
  );
}
