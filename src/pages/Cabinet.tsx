import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";

const VK_AUTH_URL = "https://functions.poehali.dev/fd9b3508-82aa-4530-b4d0-df8aed4c7e36";
const PROFILE_URL = "https://functions.poehali.dev/c770e60e-38ed-43ec-894b-d320ff17d04a";

const VK_APP_ID = import.meta.env.VITE_VK_APP_ID || "";

interface UserProfile {
  id: number;
  vk_id: number;
  vk_name: string;
  vk_photo: string;
  member_id: number | null;
  member_name: string | null;
  member_rank: string | null;
  member_rank_color: string | null;
}

interface Warning {
  id: number;
  reason: string;
  issued_by: string;
  created_at: string;
}

function getRedirectUri() {
  return `${window.location.origin}/cabinet`;
}

function buildVkOAuthUrl() {
  const params = new URLSearchParams({
    client_id: VK_APP_ID,
    redirect_uri: getRedirectUri(),
    display: "page",
    scope: "",
    response_type: "code",
    v: "5.199",
  });
  return `https://oauth.vk.com/authorize?${params}`;
}

export default function Cabinet() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [warnings, setWarnings] = useState<Warning[]>([]);

  const sessionToken = localStorage.getItem("session_token");

  async function fetchProfile(token: string) {
    const res = await fetch(PROFILE_URL, {
      headers: { "X-Session-Token": token },
    });
    const raw = await res.json();
    const data = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!res.ok) throw new Error(data.error || "Ошибка профиля");
    return data;
  }

  async function handleVkCode(code: string) {
    setAuthLoading(true);
    setError("");
    try {
      const res = await fetch(VK_AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, redirect_uri: getRedirectUri() }),
      });
      const raw = await res.json();
      const data = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (!res.ok) throw new Error(data.error || "Ошибка авторизации");
      localStorage.setItem("session_token", data.session_token);
      window.history.replaceState({}, "", "/cabinet");
      const profile = await fetchProfile(data.session_token);
      setUser(profile.user);
      setWarnings(profile.warnings || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setAuthLoading(false);
      setLoading(false);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");

    if (code) {
      handleVkCode(code);
      return;
    }

    if (sessionToken) {
      fetchProfile(sessionToken)
        .then((data) => {
          setUser(data.user);
          setWarnings(data.warnings || []);
        })
        .catch(() => {
          localStorage.removeItem("session_token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  function logout() {
    localStorage.removeItem("session_token");
    setUser(null);
    setWarnings([]);
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-sm uppercase tracking-widest">
            {authLoading ? "Авторизация..." : "Загрузка..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-14">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <span className="text-orange-500 font-bold text-xl" style={{ fontFamily: "Oswald, sans-serif" }}>
              ROSS
            </span>
            <span className="text-white/40 text-xs tracking-widest uppercase hidden sm:block">Family</span>
          </button>
          {user && (
            <button
              onClick={logout}
              className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
            >
              <Icon name="LogOut" size={16} />
              Выйти
            </button>
          )}
        </div>
      </nav>

      <div className="pt-14 max-w-4xl mx-auto px-4 py-12">
        {!user ? (
          /* ── LOGIN ── */
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
            <div className="mb-8">
              <div className="accent-line mx-auto" />
              <h1
                className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-3"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                Кабинет <span className="text-orange-500">участника</span>
              </h1>
              <p className="text-white/40 text-sm tracking-widest uppercase">
                Войди через ВКонтакте чтобы продолжить
              </p>
            </div>

            {error && (
              <div className="mb-6 px-4 py-3 border border-red-500/30 bg-red-500/10 text-red-400 text-sm max-w-sm w-full">
                {error}
              </div>
            )}

            {!VK_APP_ID ? (
              <div className="px-6 py-4 border border-orange-500/30 bg-orange-500/5 text-orange-400 text-sm max-w-sm w-full">
                Требуется настройка VK_APP_ID
              </div>
            ) : (
              <a
                href={buildVkOAuthUrl()}
                className="flex items-center gap-3 bg-[#0077ff] hover:bg-[#0066dd] text-white font-bold px-8 py-4 text-sm tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,119,255,0.4)]"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.585-1.496c.598-.19 1.365 1.26 2.182 1.817.616.422 1.084.33 1.084.33l2.178-.03s1.139-.071.599-1.084c-.044-.078-.314-.661-1.617-1.869-1.363-1.26-1.181-1.057.461-3.236.999-1.331 1.399-2.144 1.273-2.491-.12-.331-.854-.244-.854-.244l-2.451.015s-.182-.025-.317.056c-.132.079-.217.262-.217.262s-.388 1.034-.905 1.913c-1.09 1.85-1.526 1.949-1.703 1.834-.414-.267-.31-1.073-.31-1.646 0-1.79.271-2.535-.528-2.727-.265-.064-.46-.106-1.137-.113-.869-.009-1.603.003-2.019.206-.277.135-.491.436-.361.453.161.021.525.098.719.362.249.341.24 1.107.24 1.107s.143 2.11-.333 2.371c-.327.176-.775-.183-1.737-1.827-.494-.855-.868-1.8-.868-1.8s-.072-.176-.202-.271c-.157-.115-.378-.151-.378-.151l-2.328.015s-.35.01-.478.162c-.114.135-.009.414-.009.414s1.826 4.271 3.891 6.423c1.895 1.975 4.048 1.845 4.048 1.845h.975z"/>
                </svg>
                Войти через ВКонтакте
              </a>
            )}
          </div>
        ) : (
          /* ── PROFILE ── */
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-8">
              <div className="accent-line" />
              <h1
                className="text-3xl font-bold uppercase tracking-tight"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                Личный <span className="text-orange-500">кабинет</span>
              </h1>
            </div>

            {/* Profile card */}
            <div className="bg-[#111] border border-white/5 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative shrink-0">
                {user.vk_photo ? (
                  <img
                    src={user.vk_photo}
                    alt={user.vk_name}
                    className="w-20 h-20 rounded-full border-2 border-orange-500/40 object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-orange-500/20 border-2 border-orange-500/40 flex items-center justify-center text-2xl font-bold text-orange-400">
                    {user.vk_name?.[0] || "?"}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#111]" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1">ВКонтакте</p>
                <h2
                  className="text-2xl font-bold mb-1 truncate"
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  {user.vk_name}
                </h2>

                {user.member_id ? (
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-white/60 text-sm">{user.member_name}</span>
                    <span
                      className={`text-xs uppercase tracking-widest font-bold ${user.member_rank_color || "text-gray-400"}`}
                      style={{ fontFamily: "Oswald, sans-serif" }}
                    >
                      {user.member_rank}
                    </span>
                  </div>
                ) : (
                  <span className="text-white/30 text-sm">Не привязан к участнику</span>
                )}
              </div>

              <div className="flex flex-col gap-2 shrink-0 text-right">
                <div className="text-white/30 text-xs uppercase tracking-wider">Выговора</div>
                <div
                  className={`text-4xl font-bold ${warnings.length > 0 ? "text-red-400" : "text-green-400"}`}
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  {warnings.length}
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Статус", value: user.member_id ? "Участник" : "Гость", icon: "User" },
                { label: "Ранг", value: user.member_rank || "—", icon: "Shield" },
                { label: "Выговора", value: String(warnings.length), icon: "AlertTriangle" },
              ].map((s) => (
                <div key={s.label} className="bg-[#111] border border-white/5 p-4 text-center">
                  <Icon name={s.icon as "User" | "Shield" | "AlertTriangle"} size={18} className="text-orange-400 mx-auto mb-2" />
                  <div
                    className="text-lg font-bold mb-1"
                    style={{ fontFamily: "Oswald, sans-serif" }}
                  >
                    {s.value}
                  </div>
                  <div className="text-white/30 text-xs uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Warnings */}
            <div>
              <h3
                className="text-xl font-bold uppercase mb-4 flex items-center gap-2"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                <Icon name="AlertTriangle" size={18} className="text-orange-400" />
                Выговора
                {warnings.length > 0 && (
                  <span className="ml-auto text-sm text-red-400 font-normal normal-case tracking-normal">
                    {warnings.length} активных
                  </span>
                )}
              </h3>

              {warnings.length === 0 ? (
                <div className="bg-[#111] border border-white/5 p-8 text-center">
                  <Icon name="CheckCircle" size={36} className="text-green-400 mx-auto mb-3" />
                  <p className="text-white/50 text-sm">Выговоров нет — так держать!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {warnings.map((w, i) => (
                    <div
                      key={w.id}
                      className="bg-[#111] border border-red-500/20 p-5 flex items-start gap-4"
                    >
                      <span
                        className="text-red-400 font-bold text-lg shrink-0 mt-0.5"
                        style={{ fontFamily: "Oswald, sans-serif" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white/80 text-sm leading-relaxed">{w.reason}</p>
                        <div className="flex items-center gap-3 mt-2 text-white/30 text-xs">
                          {w.issued_by && <span>от {w.issued_by}</span>}
                          <span>{w.created_at}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
