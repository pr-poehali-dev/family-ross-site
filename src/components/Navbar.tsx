import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const NAV_ITEMS = [
  { id: "home", label: "Главная" },
  { id: "about", label: "О нас" },
  { id: "rules", label: "Правила" },
  { id: "cars", label: "Автопарк" },
  { id: "apply", label: "Заявка" },
  { id: "contacts", label: "Контакты" },
];

interface NavbarProps {
  active: string;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  scrollTo: (id: string) => void;
}

export default function Navbar({ active, menuOpen, setMenuOpen, scrollTo }: NavbarProps) {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <button onClick={() => scrollTo("home")} className="flex items-center gap-2">
          <span className="text-orange-500 font-bold text-xl" style={{ fontFamily: 'Oswald, sans-serif' }}>
            ROSS
          </span>
          <span className="text-white/40 text-xs tracking-widest uppercase hidden sm:block">Family</span>
        </button>

        <div className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`nav-link ${active === item.id ? "!text-orange-400" : ""}`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => navigate("/cabinet")}
            className="flex items-center gap-1.5 border border-orange-500/40 hover:border-orange-500 text-orange-400 hover:text-orange-300 px-3 py-1.5 text-xs uppercase tracking-widest transition-all"
            style={{ fontFamily: 'Oswald, sans-serif' }}
          >
            <Icon name="User" size={13} />
            Кабинет
          </button>
        </div>

        <button
          className="md:hidden text-white/70 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon name={menuOpen ? "X" : "Menu"} size={22} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-black/95 border-t border-white/5 px-4 py-4 flex flex-col gap-3">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="nav-link text-left py-2"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => { navigate("/cabinet"); setMenuOpen(false); }}
            className="nav-link text-left py-2 text-orange-400"
          >
            Кабинет
          </button>
        </div>
      )}
    </nav>
  );
}