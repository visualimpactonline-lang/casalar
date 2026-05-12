import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, DollarSign, Lock, Mail, MapPin, Phone, Search, ShieldCheck, Sparkles, Star, Trash2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { addAvaliacao, getAvaliacaoMedia, type Anuncio, CATEGORIAS, loadAnuncios, removeAnuncio } from "@/lib/anuncios-store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel admin — Casalar" },
      { name: "description", content: "Painel privado para ver prestadores cadastrados no Casalar." },
    ],
  }),
  component: AdminPage,
});

const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL as string | undefined) || "admin@casalar.com";
const ADMIN_PASSWORD = (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) || "casalar123";
const SESSION_KEY = "casalar:admin:logado";

function AdminPage() {
  const [logado, setLogado] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("Todas");

  useEffect(() => {
    const session = window.localStorage.getItem(SESSION_KEY) === "true";
    setLogado(session);
    if (session) void carregar();
    else setLoading(false);
  }, []);

  const carregar = async () => {
    setLoading(true);
    setAnuncios(await loadAnuncios());
    setLoading(false);
  };

  const entrar = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    const emailOk = email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase();
    const senhaOk = senha === ADMIN_PASSWORD;

    if (!emailOk || !senhaOk) {
      setErro("E-mail ou senha do admin incorretos.");
      return;
    }

    window.localStorage.setItem(SESSION_KEY, "true");
    setLogado(true);
    void carregar();
  };

  const sair = () => {
    window.localStorage.removeItem(SESSION_KEY);
    setLogado(false);
    setEmail("");
    setSenha("");
  };

  const excluirPrestador = async (anuncio: Anuncio) => {
    const nome = anuncio.titulo || anuncio.prestadorEmail || "este prestador";
    const confirmou = window.confirm(`Tem certeza que deseja excluir ${nome}? Essa ação remove o prestador do site.`);

    if (!confirmou) return;

    await removeAnuncio(anuncio.id);
    setAnuncios((atuais) => atuais.filter((item) => item.id !== anuncio.id));
  };

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    return anuncios.filter((a) => {
      const matchCategoria = categoria === "Todas" || a.categoria === categoria;
      const texto = `${a.titulo} ${a.categoria} ${a.subcategoria} ${a.cidade} ${a.prestadorEmail}`.toLowerCase();
      return matchCategoria && (!q || texto.includes(q));
    });
  }, [anuncios, categoria, query]);

  if (!logado) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-[0.9fr_1fr] md:px-8 md:py-16">
          <section className="rounded-3xl bg-gradient-warm p-8 text-primary-foreground shadow-warm md:p-10">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground">
              <ArrowLeft className="h-4 w-4" /> Voltar ao site
            </Link>
            <div className="mt-12 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-foreground/15">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-tight md:text-5xl">
              Painel admin privado.
            </h1>
            <p className="mt-4 max-w-md text-primary-foreground/80">
              Entre para ver todos os prestadores cadastrados, incluindo telefone e e-mail.
            </p>
          </section>

          <section className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Lock className="h-3.5 w-3.5" /> Admin Casalar
            </span>
            <h2 className="mt-6 font-display text-3xl font-semibold">Entrar no admin</h2>
            <p className="mt-2 text-sm text-muted-foreground">Acesso separado do login dos prestadores.</p>

            <form onSubmit={entrar} className="mt-8 space-y-5">
              <div className="block">
                <span className="mb-2 block text-sm font-medium">E-mail admin</span>
                <div className="flex items-center rounded-xl border border-input bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                  <Mail className="ml-4 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@casalar.com"
                    className="w-full bg-transparent px-3 py-3 text-base focus:outline-none"
                  />
                </div>
              </div>

              <div className="block">
                <span className="mb-2 block text-sm font-medium">Senha admin</span>
                <div className="flex items-center rounded-xl border border-input bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                  <Lock className="ml-4 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Digite a senha"
                    className="w-full bg-transparent px-3 py-3 text-base focus:outline-none"
                  />
                </div>
              </div>

              {erro && <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{erro}</p>}

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-soft transition-transform hover:scale-[1.01]"
              >
                Entrar no painel
              </button>
            </form>
          </section>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="border-b border-border/60 bg-gradient-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Voltar ao site
          </Link>
          <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Painel admin
              </span>
              <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">Prestadores cadastrados</h1>
              <p className="mt-2 max-w-xl text-muted-foreground">Aqui você vê os contatos dos prestadores para responder os clientes pelo WhatsApp central do Casalar.</p>
            </div>
            <button onClick={sair} className="rounded-full border border-border bg-card px-5 py-3 text-sm font-medium hover:bg-muted">
              Sair do admin
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="grid gap-4 rounded-3xl border border-border bg-card p-4 shadow-soft md:grid-cols-[1fr_220px_auto]">
          <div className="flex items-center gap-3 rounded-2xl border border-input bg-background px-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome, cidade, email..."
              className="w-full bg-transparent py-3 text-sm outline-none"
            />
          </div>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none">
            <option>Todas</option>
            {CATEGORIAS.map((cat) => <option key={cat}>{cat}</option>)}
          </select>
          <button onClick={carregar} className="rounded-2xl bg-foreground px-5 py-3 text-sm font-medium text-background hover:bg-foreground/90">
            Atualizar
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Total" value={anuncios.length} />
          <Stat label="Publicados" value={anuncios.filter((a) => a.ativo).length} />
          <Stat label="Pausados" value={anuncios.filter((a) => !a.ativo).length} />
          <Stat label="Filtrados" value={filtrados.length} />
        </div>

        {loading ? (
          <p className="mt-10 text-center text-muted-foreground">Carregando prestadores...</p>
        ) : filtrados.length === 0 ? (
          <p className="mt-10 rounded-3xl border border-dashed border-border bg-card/50 p-10 text-center text-muted-foreground">Nenhum prestador encontrado.</p>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtrados.map((a) => <AdminCard key={a.id} anuncio={a} onDelete={() => void excluirPrestador(a)} onRated={carregar} />)}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
    </div>
  );
}

function AdminCard({ anuncio, onDelete, onRated }: { anuncio: Anuncio; onDelete: () => void; onRated: () => void }) {
  const [salvandoNota, setSalvandoNota] = useState(false);
  const media = getAvaliacaoMedia(anuncio);
  const qtdAvaliacoes = anuncio.avaliacaoQtd ?? 0;
  const registrarNota = async (nota: number) => {
    const confirmou = window.confirm(`Adicionar nota ${nota} para ${anuncio.titulo || "este prestador"}?`);
    if (!confirmou) return;
    setSalvandoNota(true);
    await addAvaliacao(anuncio.id, nota);
    setSalvandoNota(false);
    onRated();
  };
  const telefone = (anuncio.prestadorTelefone ?? "").trim() || extractPhone(anuncio.descricao);
  const mensagem = encodeURIComponent(`Olá, sou do Casalar. Um cliente pediu atendimento para seu serviço: ${anuncio.titulo || anuncio.subcategoria || anuncio.categoria}.`);

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${anuncio.ativo ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}>
          {anuncio.ativo ? "Publicado" : "Pausado"}
        </span>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{anuncio.categoria || "Sem categoria"}</span>
        {anuncio.subcategoria && <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">{anuncio.subcategoria}</span>}
      </div>
      <h3 className="font-display text-xl font-semibold leading-tight">{anuncio.titulo || "Sem título"}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{anuncio.descricao || "Sem descrição."}</p>

      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
        <Meta icon={DollarSign}>{anuncio.preco ? `R$ ${anuncio.preco} / ${anuncio.unidade}` : "Valor a combinar"}</Meta>
        <Meta icon={MapPin}>{anuncio.cidade ? `${anuncio.cidade} · até ${anuncio.raio} km` : "Localização a combinar"}</Meta>
        <Meta icon={Calendar}>{`${anuncio.horarioInicio}–${anuncio.horarioFim}`}</Meta>
        <Meta icon={Mail}>{anuncio.prestadorEmail || "E-mail não informado"}</Meta>
        <Meta icon={Phone}>{telefone || "Telefone não encontrado no cadastro"}</Meta>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-muted/30 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Avaliação</p>
            <p className="mt-1 text-sm font-medium">
              {qtdAvaliacoes > 0 ? `${media.toFixed(1)} ⭐ (${qtdAvaliacoes} avaliação${qtdAvaliacoes === 1 ? "" : "es"})` : "Sem avaliações ainda"}
            </p>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((nota) => (
              <button
                key={nota}
                type="button"
                disabled={salvandoNota}
                onClick={() => void registrarNota(nota)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-sm font-semibold hover:border-primary hover:text-primary disabled:opacity-50"
                title={`Adicionar nota ${nota}`}
              >
                {nota}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto]">
        {telefone ? (
          <a href={`https://wa.me/55${telefone}?text=${mensagem}`} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]">
            Chamar prestador
          </a>
        ) : (
          <span className="inline-flex w-full items-center justify-center rounded-full bg-muted px-5 py-3 text-sm font-medium text-muted-foreground">
            Sem telefone
          </span>
        )}
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-destructive/30 px-5 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
          title="Excluir prestador"
        >
          <Trash2 className="h-4 w-4" />
          Excluir
        </button>
      </div>
    </article>
  );
}

function Meta({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 text-primary" />
      <span className="truncate">{children}</span>
    </div>
  );
}

function extractPhone(text: string) {
  const match = text.match(/(?:\+?55\s*)?(?:\(?\d{2}\)?\s*)?\d{4,5}[-\s]?\d{4}/);
  if (!match) return "";
  return match[0].replace(/\D/g, "").replace(/^55/, "");
}
