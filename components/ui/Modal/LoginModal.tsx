"use client";

import { useState } from "react";

import Modal from "./Modal";
import { loginWithGoogle } from "@/services/client/auth";
import Image from "next/image";
import { LogIn } from "lucide-react";

type ModalTriggerProps = {
  title: string;
};

export default function LoginModal({ title }: ModalTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-x-2 text-sm font-medium text-muted-foreground hover:text-emerald-500 transition-all duration-300 group"
      >
        <LogIn
          size={18}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span>{title}</span>
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={title}>
        <p className="text-sm text-muted-foreground leading-relaxed">
          أهلاً بك. تسجيل الدخول يتيح لك التفاعل مع المنشورات مستقبلاً.
        </p>

        <div className="flex flex-col gap-y-3 mt-2">
          <button
            className="flex items-center justify-center gap-x-3 w-full bg-white dark:bg-white/5 border border-[#E5E7EB] dark:border-[#1F2937] py-3 rounded-2xl text-foreground font-medium hover:bg-gray-50 dark:hover:bg-white/10 hover:border-emerald-500/50 transition-all shadow-sm"
            onClick={() => loginWithGoogle()}
          >
            <Image height={20} width={20} src="/google.svg" alt="google" />
            <span>المتابعة باستخدام Google</span>
          </button>

          {/* <p className="text-[10px] text-center text-muted-foreground/60">
            بالاستمرار، أنت توافق على شروط الاستخدام وسياسة الخصوصية.
          </p> */}
        </div>
      </Modal>
    </>
  );
}
