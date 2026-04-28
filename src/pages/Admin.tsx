import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const API = "https://functions.poehali.dev/15a21d1d-ef07-4cc3-8306-ac420bc9d468";

const RANKS = [
  { label: "Лидер", value: "Лидер", color: "text-orange-400" },
  { label: "Заместитель", value: "Заместитель", color: "text-orange-300" },
  { label: "Старший состав", value: "Старший состав", color: "text-gray-300" },
  { label: "Младший состав", value: "Младший состав", color: "text-gray-400" },
  { label: "Стажёр", value: "Стажёр", color: "text-gray-500" },
];

interface Member {
  id: number; name: string; rank: string; rank_color: string;
  joined_at: string; note: string;
  user_id: number | null; vk_id: number | null; vk_name: string | null; vk_photo: string | null;
  warn_count: number;
}
interface VkUser { id: number; vk_id: number; vk_name: string; vk_photo: string; member_id: number | null; member_name: string | null; }
interface Warning { id: number; member_id: number; member_name: string; reason: string; issued_by: string; created_at: string; }

type Tab = "members" | "warnings" | "users";

export default function Admin() {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem("admin_token") || "");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [tab, setTab] = useState<Tab>("members");
  const [members, setMembers] = useState<Member[]>([]);
  const [users, setUsers] = useState<VkUser[]>([]);
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [loading, setLoading] = useState(false);

  // Modals
  const [memberModal, setMemberModal] = useState<"add" | "edit" | null>(null);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [memberForm, setMemberForm] = useState({ name: "", rank: "Солдат", rank_color: "text-gray-400", note: "" });

  const [warnModal, setWarnModal] = useState(false);
  const [warnForm, setWarnForm] = useState({ member_id: "", reason: "", issued_by: "" });

  const [linkModal, setLinkModal] = useState(false);
  const [linkForm, setLinkForm] = useState({ user_id: "", member_id: "" });

  const apiFetch = useCallback(async (path: string, options: RequestInit = {}) => {
    const res = await fetch(`${API}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", "X-Admin-Token": token, ...(options.headers || {}) },
    });
    const raw = await res.json();
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  }, [token]);

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [m, w, u] = await Promise.all([
        apiFetch("/members"),
        apiFetch("/warnings"),
        apiFetch("/users"),
      ]);
      setMembers(m.members || []);
      setWarnings(w.warnings || []);
      setUsers(u.users || []);
    } finally {
      setLoading(false);
    }
  }, [apiFetch, token]);

  useEffect(() => { if (token) loadData(); }, [token, loadData]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true); setLoginError("");
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const raw = await res.json();
      const data = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (!res.ok) throw new Error(data.error || "Ошибка");
      localStorage.setItem("admin_token", data.token);
      setToken(data.token);
    } catch (e: unknown) {
      setLoginError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setLoginLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("admin_token");
    setToken(""); setMembers([]); setWarnings([]); setUsers([]);
  }

  async function saveMember() {
    const rankObj = RANKS.find(r => r.value === memberForm.rank);
    const payload = { ...memberForm, rank_color: rankObj?.color || "text-gray-400" };
    if (memberModal === "add") {
      await apiFetch("/members", { method: "POST", body: JSON.stringify(payload) });
    } else if (editMember) {
      await apiFetch(`/members/${editMember.id}`, { method: "PUT", body: JSON.stringify(payload) });
    }
    setMemberModal(null); loadData();
  }

  async function addWarning() {
    await apiFetch("/warnings", { method: "POST", body: JSON.stringify({ ...warnForm, member_id: Number(warnForm.member_id) }) });
    setWarnModal(false); setWarnForm({ member_id: "", reason: "", issued_by: "" }); loadData();
  }

  async function removeWarning(id: number) {
    await apiFetch(`/warnings/remove/${id}`, { method: "POST" });
    loadData();
  }

  async function linkUser() {
    await apiFetch("/link", { method: "POST", body: JSON.stringify({ user_id: Number(linkForm.user_id), member_id: Number(linkForm.member_id) }) });
    setLinkModal(false); setLinkForm({ user_id: "", member_id: "" }); loadData();
  }

  function openEdit(m: Member) {
    setEditMember(m);
    setMemberForm({ name: m.name, rank: m.rank, rank_color: m.rank_color, note: m.note });
    setMemberModal("edit");
  }

  const inputCls = "w-full bg-[#0d0d0d] border border-white/10 focus:border-orange-500/50 text-white px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-white/20";
  const selectCls = inputCls + " cursor-pointer";
  const btnOrange = "bg-orange-500 hover:bg-orange-400 text-black font-bold px-5 py-2.5 text-xs uppercase tracking-widest transition-all";
  const btnGhost = "border border-white/10 hover:border-white/30 text-white/50 hover:text-white px-4 py-2 text-xs uppercase tracking-wider transition-all";

  if (!token) return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="accent-line mx-auto" />
          <h1 className="text-3xl font-bold uppercase tracking-tight mt-2" style={{ fontFamily: "Oswald, sans-serif" }}>
            Админ <span className="text-orange-500">панель</span>
          </h1>
          <p className="text-white/30 text-xs tracking-widest uppercase mt-1">Family Ross</p>
        </div>
        {loginError && <div className="mb-4 px-4 py-3 border border-red-500/30 bg-red-500/10 text-red-400 text-sm">{loginError}</div>}
        <form onSubmit={login} className="space-y-4">
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Пароль" required className={inputCls} />
          <button type="submit" disabled={loginLoading} className={`${btnOrange} w-full`} style={{ fontFamily: "Oswald, sans-serif" }}>
            {loginLoading ? "Вход..." : "Войти"}
          </button>
        </form>
        <button onClick={() => navigate("/")} className="mt-4 w-full text-center text-white/20 hover:text-white/40 text-xs transition-colors">
          ← На главную
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="text-orange-500 font-bold text-xl" style={{ fontFamily: "Oswald, sans-serif" }}>ROSS</button>
            <span className="text-white/20 text-xs">|</span>
            <span className="text-white/40 text-xs uppercase tracking-widest">Админ</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadData} className="text-white/30 hover:text-white transition-colors">
              <Icon name="RefreshCw" size={15} />
            </button>
            <button onClick={logout} className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm transition-colors">
              <Icon name="LogOut" size={15} />
              <span className="hidden sm:block text-xs uppercase tracking-wider">Выйти</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-14 max-w-6xl mx-auto px-4 py-8">
        {/* TABS */}
        <div className="flex gap-1 mb-8 border-b border-white/5 pb-0">
          {([
            { id: "members", label: "Участники", icon: "Users", count: members.length },
            { id: "warnings", label: "Выговора", icon: "AlertTriangle", count: warnings.length },
            { id: "users", label: "VK Пользователи", icon: "Link", count: users.length },
          ] as const).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs uppercase tracking-wider border-b-2 transition-all -mb-px ${tab === t.id ? "border-orange-500 text-orange-400" : "border-transparent text-white/30 hover:text-white/60"}`}
              style={{ fontFamily: "Oswald, sans-serif" }}>
              <Icon name={t.icon as "Users" | "AlertTriangle" | "Link"} size={14} />
              {t.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-sm ${tab === t.id ? "bg-orange-500/20 text-orange-400" : "bg-white/5 text-white/30"}`}>{t.count}</span>
            </button>
          ))}
        </div>

        {loading && <div className="text-center py-16 text-white/30 text-sm">Загрузка...</div>}

        {/* ── MEMBERS TAB ── */}
        {!loading && tab === "members" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold uppercase" style={{ fontFamily: "Oswald, sans-serif" }}>Участники</h2>
              <button onClick={() => { setMemberForm({ name: "", rank: "Солдат", rank_color: "text-gray-400", note: "" }); setMemberModal("add"); }} className={btnOrange} style={{ fontFamily: "Oswald, sans-serif" }}>
                + Добавить
              </button>
            </div>
            <div className="space-y-2">
              {members.map(m => (
                <div key={m.id} className="bg-[#111] border border-white/5 p-4 flex items-center gap-4 hover:border-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-xs font-bold text-orange-400 shrink-0">
                    {m.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-bold text-sm">{m.name}</span>
                      <span className={`text-xs uppercase tracking-wider ${m.rank_color}`} style={{ fontFamily: "Oswald, sans-serif" }}>{m.rank}</span>
                      {m.warn_count > 0 && (
                        <span className="text-xs text-red-400 flex items-center gap-1">
                          <Icon name="AlertTriangle" size={11} /> {m.warn_count}
                        </span>
                      )}
                    </div>
                    {m.vk_name && <p className="text-white/30 text-xs mt-0.5 truncate">ВК: {m.vk_name}</p>}
                    {m.note && <p className="text-white/20 text-xs mt-0.5 truncate">{m.note}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => { setWarnForm(f => ({ ...f, member_id: String(m.id) })); setWarnModal(true); }}
                      className="p-2 text-white/20 hover:text-red-400 transition-colors" title="Выдать выговор">
                      <Icon name="AlertTriangle" size={15} />
                    </button>
                    <button onClick={() => openEdit(m)} className="p-2 text-white/20 hover:text-orange-400 transition-colors" title="Редактировать">
                      <Icon name="Pencil" size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── WARNINGS TAB ── */}
        {!loading && tab === "warnings" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold uppercase" style={{ fontFamily: "Oswald, sans-serif" }}>Выговора</h2>
              <button onClick={() => setWarnModal(true)} className={btnOrange} style={{ fontFamily: "Oswald, sans-serif" }}>
                + Выдать
              </button>
            </div>
            {warnings.length === 0 ? (
              <div className="text-center py-16 text-white/20 text-sm">Выговоров нет</div>
            ) : (
              <div className="space-y-2">
                {warnings.map((w, i) => (
                  <div key={w.id} className="bg-[#111] border border-red-500/10 p-4 flex items-start gap-4">
                    <span className="text-red-400 font-bold text-base shrink-0 mt-0.5" style={{ fontFamily: "Oswald, sans-serif" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-orange-400 text-xs font-bold uppercase tracking-wider">{w.member_name}</span>
                        <span className="text-white/20 text-xs">{w.created_at}</span>
                        {w.issued_by && <span className="text-white/30 text-xs">от {w.issued_by}</span>}
                      </div>
                      <p className="text-white/70 text-sm">{w.reason}</p>
                    </div>
                    <button onClick={() => removeWarning(w.id)} className="shrink-0 p-2 text-white/20 hover:text-red-400 transition-colors" title="Снять выговор">
                      <Icon name="X" size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── USERS TAB ── */}
        {!loading && tab === "users" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold uppercase" style={{ fontFamily: "Oswald, sans-serif" }}>VK Пользователи</h2>
              <button onClick={() => setLinkModal(true)} className={btnOrange} style={{ fontFamily: "Oswald, sans-serif" }}>
                Привязать
              </button>
            </div>
            {users.length === 0 ? (
              <div className="text-center py-16 text-white/20 text-sm">Нет зарегистрированных пользователей</div>
            ) : (
              <div className="space-y-2">
                {users.map(u => (
                  <div key={u.id} className="bg-[#111] border border-white/5 p-4 flex items-center gap-4">
                    {u.vk_photo
                      ? <img src={u.vk_photo} className="w-9 h-9 rounded-full border border-white/10 shrink-0" alt="" />
                      : <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm text-white/30 shrink-0">{u.vk_name?.[0]}</div>
                    }
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm">{u.vk_name}</p>
                      <p className="text-white/30 text-xs">VK ID: {u.vk_id}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {u.member_name
                        ? <span className="text-orange-400 text-xs">{u.member_name}</span>
                        : <span className="text-white/20 text-xs">Не привязан</span>
                      }
                    </div>
                    <button onClick={() => { setLinkForm({ user_id: String(u.id), member_id: String(u.member_id || "") }); setLinkModal(true); }}
                      className="p-2 text-white/20 hover:text-orange-400 transition-colors shrink-0" title="Привязать">
                      <Icon name="Link" size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── MODAL: ADD/EDIT MEMBER ── */}
      {memberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 w-full max-w-md p-6">
            <h3 className="text-xl font-bold uppercase mb-5" style={{ fontFamily: "Oswald, sans-serif" }}>
              {memberModal === "add" ? "Добавить участника" : "Редактировать"}
            </h3>
            <div className="space-y-3">
              <input value={memberForm.name} onChange={e => setMemberForm(f => ({ ...f, name: e.target.value }))} placeholder="Имя Фамилия (напр. Pedro Ross)" className={inputCls} />
              <select value={memberForm.rank} onChange={e => setMemberForm(f => ({ ...f, rank: e.target.value }))} className={selectCls}>
                {RANKS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
              <textarea value={memberForm.note} onChange={e => setMemberForm(f => ({ ...f, note: e.target.value }))} placeholder="Заметка (необязательно)" rows={2}
                className={inputCls + " resize-none"} />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={saveMember} className={btnOrange} style={{ fontFamily: "Oswald, sans-serif" }}>Сохранить</button>
              <button onClick={() => setMemberModal(null)} className={btnGhost}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD WARNING ── */}
      {warnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 w-full max-w-md p-6">
            <h3 className="text-xl font-bold uppercase mb-5" style={{ fontFamily: "Oswald, sans-serif" }}>Выдать выговор</h3>
            <div className="space-y-3">
              <select value={warnForm.member_id} onChange={e => setWarnForm(f => ({ ...f, member_id: e.target.value }))} className={selectCls}>
                <option value="">Выбери участника</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name} — {m.rank}</option>)}
              </select>
              <textarea value={warnForm.reason} onChange={e => setWarnForm(f => ({ ...f, reason: e.target.value }))}
                placeholder="Причина выговора" rows={3} className={inputCls + " resize-none"} />
              <input value={warnForm.issued_by} onChange={e => setWarnForm(f => ({ ...f, issued_by: e.target.value }))}
                placeholder="Кто выдаёт (твоё имя)" className={inputCls} />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={addWarning} className={btnOrange} style={{ fontFamily: "Oswald, sans-serif" }}>Выдать</button>
              <button onClick={() => { setWarnModal(false); setWarnForm({ member_id: "", reason: "", issued_by: "" }); }} className={btnGhost}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: LINK USER ── */}
      {linkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 w-full max-w-md p-6">
            <h3 className="text-xl font-bold uppercase mb-5" style={{ fontFamily: "Oswald, sans-serif" }}>Привязать VK → участника</h3>
            <div className="space-y-3">
              <select value={linkForm.user_id} onChange={e => setLinkForm(f => ({ ...f, user_id: e.target.value }))} className={selectCls}>
                <option value="">Выбери VK пользователя</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.vk_name} (vk{u.vk_id})</option>)}
              </select>
              <select value={linkForm.member_id} onChange={e => setLinkForm(f => ({ ...f, member_id: e.target.value }))} className={selectCls}>
                <option value="">Выбери участника</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name} — {m.rank}</option>)}
              </select>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={linkUser} className={btnOrange} style={{ fontFamily: "Oswald, sans-serif" }}>Привязать</button>
              <button onClick={() => { setLinkModal(false); setLinkForm({ user_id: "", member_id: "" }); }} className={btnGhost}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}