"use client";
import React from "react";
import { Button } from "./ui/Button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

const CloseModal = () => {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.back()}
      aria-label="close modal"
      variant={"subtle"}
      className="w-6 h-6 p-0 rounded-md"
    >
      <X className="w-4 h-4" />
    </Button>
  );
};

export default CloseModal;
