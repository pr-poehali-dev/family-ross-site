import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sections from "@/components/Sections";
import ApplySection from "@/components/ApplySection";
import Footer from "@/components/Footer";

interface FormData {
  age: string;
  hasVkDs: string;
  hoursPerDay: string;
  level: string;
  changeName: string;
  name: string;
  contacts: string;
}

export default function Index() {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormData>({
    age: "",
    hasVkDs: "",
    hoursPerDay: "",
    level: "",
    changeName: "",
    name: "",
    contacts: "",
  });

  const scrollTo = (id: string) => {
    setActive(id);
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <Navbar
        active={active}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        scrollTo={scrollTo}
      />
      <Sections scrollTo={scrollTo} />
      <ApplySection
        submitted={submitted}
        form={form}
        setForm={setForm}
        handleSubmit={handleSubmit}
      />
      <Footer />
    </div>
  );
}
