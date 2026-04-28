import { useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/4b82c5e8-f91b-4dc2-8a01-f4ceb7e4d594/files/7ef7dd6e-73c4-4f92-86c3-3b4c4c9db702.jpg";
const CARS_IMG = "https://cdn.poehali.dev/projects/4b82c5e8-f91b-4dc2-8a01-f4ceb7e4d594/files/abb3a7d1-1bc2-43a5-9b43-58c1c4c6672f.jpg";

const NAV_ITEMS = [
  { id: "home", label: "Главная" },
  { id: "about", label: "О нас" },
  { id: "rules", label: "Правила" },
  { id: "cars", label: "Автопарк" },
  { id: "apply", label: "Заявка" },
  { id: "contacts", label: "Контакты" },
];

const MEMBERS = [
  { name: "Armando Ross", rank: "Основатель", rank_color: "text-orange-400" },
  { name: "Carlos Ross", rank: "Заместитель", rank_color: "text-orange-300" },
  { name: "Miguel Ross", rank: "Капитан", rank_color: "text-gray-300" },
  { name: "Diego Ross", rank: "Капитан", rank_color: "text-gray-300" },
  { name: "Juan Ross", rank: "Солдат", rank_color: "text-gray-400" },
  { name: "Pedro Ross", rank: "Солдат", rank_color: "text-gray-400" },
];

const RULES = [
  "Уважай членов семьи и не провоцируй конфликты внутри",
  "Обязательное присутствие на семейных ивентах минимум 2 раза в неделю",
  "Запрещено предавать семью и переходить к врагам",
  "Все действия от имени семьи согласуются с главой",
  "Новый участник проходит испытательный срок 7 дней",
  "Запрещено участвовать в незаконных схемах без ведома главы",
  "Смена фамилии обязательна при вступлении в семью",
  "Нарушение правил — исключение без права на возврат",
];

const CARS = [
  { name: "Infernus", type: "Суперкар", speed: "220 км/ч" },
  { name: "Turismo", type: "Суперкар", speed: "215 км/ч" },
  { name: "Sultan RS", type: "Спорт", speed: "190 км/ч" },
  { name: "Feltzer", type: "Кабриолет", speed: "175 км/ч" },
  { name: "Maverick", type: "Вертолёт", speed: "150 км/ч" },
  { name: "Patriot", type: "Внедорожник", speed: "160 км/ч" },
];

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
      {/* NAV */}
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
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0d0d0d]" />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-950/30 via-transparent to-transparent" />

        <div className="relative z-10 text-center px-4 animate-fade-up">
          <div
            className="inline-block border border-orange-500/30 px-4 py-1 mb-6 text-orange-400 text-xs tracking-[0.3em] uppercase"
            style={{ fontFamily: 'Oswald, sans-serif' }}
          >
            MTA Province #1
          </div>
          <h1
            className="text-6xl md:text-9xl font-bold tracking-tight mb-4 glow-orange"
            style={{ fontFamily: 'Oswald, sans-serif' }}
          >
            FAMILY<br />
            <span className="text-orange-500">ROSS</span>
          </h1>
          <p className="text-white/50 text-lg md:text-xl mb-10 max-w-md mx-auto tracking-wide">
            Одна кровь. Один закон. Одна семья.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => scrollTo("apply")}
              className="bg-orange-500 hover:bg-orange-400 text-black font-bold px-8 py-3 text-sm tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,120,0,0.5)]"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              Вступить в семью
            </button>
            <button
              onClick={() => scrollTo("about")}
              className="border border-white/20 hover:border-orange-500/50 text-white/70 hover:text-white font-medium px-8 py-3 text-sm tracking-widest uppercase transition-all duration-300"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              Узнать больше
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <Icon name="ChevronDown" size={20} className="text-orange-500/60" />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <div className="accent-line" />
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-3">
              О <span className="text-orange-500">Семье</span>
            </h2>
            <p className="text-white/40 text-sm tracking-widest uppercase">Family Ross — Province #1</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <div>
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                <span className="text-orange-400 font-semibold">Family Ross</span> — одна из старейших и уважаемых семей на просторах MTA Province. Мы строим настоящее братство, где каждый участник — часть единого целого.
              </p>
              <p className="text-white/50 leading-relaxed">
                Наши принципы: честность, лояльность и взаимопомощь. Мы не просто играем вместе — мы живём как одна семья, поддерживая друг друга в любых ситуациях.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { label: "Участников", value: "24+" },
                  { label: "Месяцев", value: "18" },
                  { label: "Провинция", value: "#1" },
                ].map((stat) => (
                  <div key={stat.label} className="border border-white/10 p-4 text-center">
                    <div
                      className="text-3xl font-bold text-orange-400 mb-1"
                      style={{ fontFamily: 'Oswald, sans-serif' }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-white/40 text-xs uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-2 -left-2 w-full h-full border border-orange-500/20" />
              <div className="bg-[#111] p-6 relative">
                <h3
                  className="text-xl font-bold uppercase mb-4 text-orange-400"
                  style={{ fontFamily: 'Oswald, sans-serif' }}
                >
                  Состав семьи
                </h3>
                <div className="space-y-3">
                  {MEMBERS.map((m, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-xs font-bold text-orange-400">
                          {m.name[0]}
                        </div>
                        <span className="text-white/80 text-sm">{m.name}</span>
                      </div>
                      <span
                        className={`text-xs uppercase tracking-wider ${m.rank_color}`}
                        style={{ fontFamily: 'Oswald, sans-serif' }}
                      >
                        {m.rank}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RULES */}
      <section id="rules" className="py-24 px-4 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <div className="accent-line" />
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-3">
              Правила <span className="text-orange-500">Семьи</span>
            </h2>
            <p className="text-white/40 text-sm tracking-widest uppercase">Кодекс чести Ross</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {RULES.map((rule, i) => (
              <div
                key={i}
                className="card-hover flex items-start gap-4 p-5 bg-[#111] border border-white/5 hover:border-orange-500/20"
              >
                <span
                  className="text-orange-500 font-bold text-xl shrink-0 mt-0.5"
                  style={{ fontFamily: 'Oswald, sans-serif' }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-white/70 leading-relaxed text-sm">{rule}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CARS */}
      <section id="cars" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <div className="accent-line" />
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-3">
              Авто<span className="text-orange-500">Парк</span>
            </h2>
            <p className="text-white/40 text-sm tracking-widest uppercase">Транспорт семьи</p>
          </div>

          <div className="relative mb-12 overflow-hidden">
            <img src={CARS_IMG} alt="Автопарк Family Ross" className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6">
              <span
                className="text-orange-400 text-sm uppercase tracking-widest"
                style={{ fontFamily: 'Oswald, sans-serif' }}
              >
                Флот семьи Ross
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CARS.map((car, i) => (
              <div
                key={i}
                className="card-hover bg-[#111] border border-white/5 hover:border-orange-500/20 p-5 group"
              >
                <Icon name="Car" size={28} className="text-orange-500/60 mb-3 group-hover:text-orange-400 transition-colors" />
                <h3
                  className="text-lg font-bold uppercase mb-1"
                  style={{ fontFamily: 'Oswald, sans-serif' }}
                >
                  {car.name}
                </h3>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-2">{car.type}</p>
                <div className="flex items-center gap-1 text-orange-400 text-sm">
                  <Icon name="Gauge" size={12} />
                  <span>{car.speed}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPLY */}
      <section id="apply" className="py-24 px-4 bg-[#0a0a0a]">
        <div className="max-w-2xl mx-auto">
          <div className="mb-16">
            <div className="accent-line" />
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-3">
              Подать <span className="text-orange-500">Заявку</span>
            </h2>
            <p className="text-white/40 text-sm tracking-widest uppercase">Вступление в Family Ross</p>
          </div>

          {submitted ? (
            <div className="text-center py-16 border border-orange-500/20 bg-orange-500/5">
              <Icon name="CheckCircle" size={48} className="text-orange-400 mx-auto mb-4" />
              <h3
                className="text-2xl font-bold uppercase mb-2"
                style={{ fontFamily: 'Oswald, sans-serif' }}
              >
                Заявка отправлена
              </h3>
              <p className="text-white/50">Мы рассмотрим вашу заявку и свяжемся с вами</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">
                  Ваш игровой ник
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Имя Фамилия"
                  required
                  className="w-full bg-[#111] border border-white/10 focus:border-orange-500/50 text-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/20"
                />
              </div>

              <div>
                <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">
                  1. Есть ли вам 16 лет?
                </label>
                <div className="flex gap-3">
                  {["Да", "Нет"].map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setForm({ ...form, age: opt })}
                      className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider border transition-all ${
                        form.age === opt
                          ? "bg-orange-500 border-orange-500 text-black"
                          : "border-white/10 text-white/50 hover:border-white/30"
                      }`}
                      style={{ fontFamily: 'Oswald, sans-serif' }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">
                  2. Есть ли у вас ВКонтакте и Discord?
                </label>
                <div className="flex gap-3">
                  {["Да", "Нет"].map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setForm({ ...form, hasVkDs: opt })}
                      className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider border transition-all ${
                        form.hasVkDs === opt
                          ? "bg-orange-500 border-orange-500 text-black"
                          : "border-white/10 text-white/50 hover:border-white/30"
                      }`}
                      style={{ fontFamily: 'Oswald, sans-serif' }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">
                  3. Сколько часов в день вы играете?
                </label>
                <input
                  type="text"
                  value={form.hoursPerDay}
                  onChange={(e) => setForm({ ...form, hoursPerDay: e.target.value })}
                  placeholder="Например: 3-4 часа"
                  className="w-full bg-[#111] border border-white/10 focus:border-orange-500/50 text-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/20"
                />
              </div>

              <div>
                <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">
                  4. Какой у вас игровой уровень?
                </label>
                <input
                  type="text"
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                  placeholder="Например: 15"
                  className="w-full bg-[#111] border border-white/10 focus:border-orange-500/50 text-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/20"
                />
              </div>

              <div>
                <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">
                  5. Готовы ли вы сменить фамилию?
                </label>
                <div className="flex gap-3">
                  {["Да", "Нет"].map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setForm({ ...form, changeName: opt })}
                      className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider border transition-all ${
                        form.changeName === opt
                          ? "bg-orange-500 border-orange-500 text-black"
                          : "border-white/10 text-white/50 hover:border-white/30"
                      }`}
                      style={{ fontFamily: 'Oswald, sans-serif' }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">
                  Контакты (ВК / Discord)
                </label>
                <input
                  type="text"
                  value={form.contacts}
                  onChange={(e) => setForm({ ...form, contacts: e.target.value })}
                  placeholder="@username / User#0000"
                  className="w-full bg-[#111] border border-white/10 focus:border-orange-500/50 text-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/20"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-400 text-black font-bold py-4 text-sm tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,120,0,0.4)] mt-4"
                style={{ fontFamily: 'Oswald, sans-serif' }}
              >
                Отправить заявку
              </button>
            </form>
          )}
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <div className="accent-line" />
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-3">
              Конт<span className="text-orange-500">акты</span>
            </h2>
            <p className="text-white/40 text-sm tracking-widest uppercase">Связь с семьёй</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: "MessageCircle",
                label: "ВКонтакте",
                value: "vk.com/familyross",
                desc: "Официальная группа",
              },
              {
                icon: "Hash",
                label: "Discord",
                value: "discord.gg/familyross",
                desc: "Сервер семьи",
              },
              {
                icon: "Gamepad2",
                label: "MTA Province",
                value: "Province #1",
                desc: "Сервер игры",
              },
            ].map((c, i) => (
              <div
                key={i}
                className="card-hover bg-[#111] border border-white/5 hover:border-orange-500/20 p-6 group text-center"
              >
                <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/20 transition-colors">
                  <Icon name={c.icon as "MessageCircle" | "Hash" | "Gamepad2"} size={22} className="text-orange-400" />
                </div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{c.label}</p>
                <p className="text-white font-bold mb-1" style={{ fontFamily: 'Oswald, sans-serif' }}>{c.value}</p>
                <p className="text-white/30 text-xs">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-8 px-4 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-orange-500 font-bold text-lg" style={{ fontFamily: 'Oswald, sans-serif' }}>
              FAMILY ROSS
            </span>
            <span className="text-white/20 text-xs">|</span>
            <span className="text-white/30 text-xs tracking-widest uppercase">MTA Province #1</span>
          </div>
          <p className="text-white/20 text-xs">© 2024 Family Ross. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
