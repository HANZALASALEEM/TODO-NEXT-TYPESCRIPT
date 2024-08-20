import React from "react";
import style from "./Modal.module.css";
import Image from "next/image";
const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: Boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;
  return (
    <div className={style.modalBackdrop}>
      <div className={style.modalContent}>
        <button className=" py-2 px-2" onClick={onClose}>
          <Image src="/images/close.png" alt="close" width={20} height={20} />
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;
