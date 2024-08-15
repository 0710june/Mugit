"use client";

import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  showCloseButton: true,
});

type ToastProps = {
  type: string;
  title: string;
  text?: string;
};

export default function fireToast({ type, title, text }: ToastProps) {
  if (type === "성공") {
    Toast.fire({
      icon: "success",
      title: title,
      text: text ? text : "",
    });
    return;
  }

  if (type === "에러") {
    Toast.fire({
      icon: "error",
      title: title,
      text: text ? text : "",
    });
    return;
  }

  if (type === "경고") {
    Toast.fire({
      icon: "warning",
      title: title,
      text: text ? text : "",
    });
    return;
  }

  if (type === "정보") {
    Toast.fire({
      icon: "info",
      title: title,
      text: text ? text : "",
    });
    return;
  }

  if (type === "질문") {
    Toast.fire({
      icon: "question",
      title: title,
      text: text ? text : "",
    });
    return;
  }
}
