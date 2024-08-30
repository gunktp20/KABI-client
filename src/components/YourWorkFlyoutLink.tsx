import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const YourWorkFlyoutLink = () => {
  return (
    <button>
      <FlyoutLink FlyoutContent={Content}>Your Projects</FlyoutLink>
    </button>
  );
};

interface IPropFlyoutLink {
  children: string | JSX.Element;
  FlyoutContent: React.ElementType;
}

const FlyoutLink = ({ children, FlyoutContent }: IPropFlyoutLink) => {
  const [open, setOpen] = useState(false);
  const flyoutRef = useRef<HTMLDivElement>(null);
  const showFlyout = open;

  const toggleFlyout = () => setOpen(!open);

  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      onClick={toggleFlyout}
      ref={flyoutRef} 
      className="flex items-center py-2 ml-12 border-b-transparent border-b-[2px] hover:border-b-primary-500 text-[13.4px] cursor-pointer transition-all relative z-[10]"
    >
      <a className="relative text-primary-700 text-[13px] font-semibold">{children}</a>
      <AnimatePresence>
        {showFlyout && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            style={{ translateX: "-20%" }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className="absolute left-1/2 top-[2.3rem] text-black"
          >
            <div className="absolute -top-6 left-0 right-0 h-6 bg-transparent" />
            <FlyoutContent />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Content = () => {
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div onClick={handleClick} className="flex p-5 flex-col w-[250px] bg-white border-[#e1e1e1] shadow-sm border-[1px]">
      <div className="border-b-[1px] pb-4 mb-5">
        <p className="text-[13px] mb-3 text-left">
          รับส่วนลดพิเศษสำหรับสมาชิก Carental
          พร้อมการจองที่รวดเร็วและไม่ยุ่งยาก!
        </p>
        <div
          onClick={() => {
            navigate("/login");
          }}
          className="bg-primary-500 rounded-lg text-white w-[100%] py-2"
        >
          เข้าสู่ระบบ
        </div>
      </div>
      <div>
        <p className="text-[13px] mb-3 text-left">
          เข้าเว็บไซต์ Carental เป็นครั้งแรกใช่ไหม?
        </p>
        <div
          onClick={() => {
            navigate("/register");
          }}
          className="border-primary-700 border-[1px] rounded-lg text-primary-700 w-[100%] py-2"
        >
          สมัครสมาชิก
        </div>
      </div>
    </div>
  );
};

export default YourWorkFlyoutLink;
