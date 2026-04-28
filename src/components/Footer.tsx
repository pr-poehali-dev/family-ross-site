import Icon from "@/components/ui/icon";

export default function Footer() {
  return (
    <>
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
          <div className="flex flex-col md:flex-row items-center gap-3 text-xs text-white/20">
            <span>© 2026 Family Ross. Все права защищены.</span>
            <span className="hidden md:block">·</span>
            <a
              href="https://vk.com/id1089780734"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-orange-400 transition-colors"
            >
              Разработчик Ethan_Santoro
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
