import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const MEMBERS_URL = "https://functions.poehali.dev/1ff6ae19-ed30-416e-bab5-91b7128e6e3a";

const HERO_IMG = "https://cdn.poehali.dev/projects/4b82c5e8-f91b-4dc2-8a01-f4ceb7e4d594/files/7ef7dd6e-73c4-4f92-86c3-3b4c4c9db702.jpg";
const CARS_IMG = "https://cdn.poehali.dev/projects/4b82c5e8-f91b-4dc2-8a01-f4ceb7e4d594/files/abb3a7d1-1bc2-43a5-9b43-58c1c4c6672f.jpg";

interface Member {
  id: number;
  name: string;
  rank: string;
  rank_color: string;
}

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

interface SectionsProps {
  scrollTo: (id: string) => void;
}

export default function Sections({ scrollTo }: SectionsProps) {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    fetch(MEMBERS_URL)
      .then((r) => r.json())
      .then((data) => {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        setMembers(parsed.members || []);
      })
      .catch(() => {});
  }, []);

  return (
    <>
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
                  {members.length === 0 && (
                    <p className="text-white/30 text-sm text-center py-4">Загрузка...</p>
                  )}
                  {members.map((m) => (
                    <div key={m.id} className="flex items-center justify-between py-2 border-b border-white/5">
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
    </>
  );
}