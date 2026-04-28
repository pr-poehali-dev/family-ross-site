import { useState } from "react";
import Icon from "@/components/ui/icon";

interface FormData {
  age: string;
  hasVkDs: string;
  hoursPerDay: string;
  level: string;
  changeName: string;
  name: string;
  contacts: string;
}

interface ApplySectionProps {
  submitted: boolean;
  form: FormData;
  setForm: (form: FormData) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export default function ApplySection({ submitted, form, setForm, handleSubmit }: ApplySectionProps) {
  return (
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
  );
}
