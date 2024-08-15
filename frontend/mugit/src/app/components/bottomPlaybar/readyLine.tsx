"use client";
import { motion } from "framer-motion";

type PropsType = {
  key: number;
};

export default function ReadyLine() {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{
        duration: 0.4,
      }}
      style={{ originX: 0.5 }} // 확장의 시작점을 중앙으로 설정
      className="mb-2 h-1 w-[590px] bg-pointyellow"
    ></motion.div>
  );
}
