import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { ArrowLeft, Calendar, DollarSign, MapPin, Search, Sparkles, Star, Clock } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getAvaliacaoMedia, type Anuncio, CATEGORIAS, CIDADES_ATENDIDAS, loadAnuncios } from "@/lib/anuncios-store";

export const Route = createFileRoute("/servicos")({
  validateSearch: (search: Record<string, unknown>) => ({
    categoria: typeof search.categoria === "string" ? search.categoria : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
    cidade: typeof search.cidade === "string" ? search.cidade : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Encontrar serviços — Casalar" },
      { name: "description", content: "Veja profissionais anunciados por categoria e encontre o serviço que você precisa." },
    ],
  }),
  component: ServicosPage,
});

function ServicosPage() {
  const search = useSearch({ from: "/servicos" });
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [query, setQuery] = useState(search.q ?? "");
  const [categoria, setCategoria] = useState(search.categoria ?? "Todas");
  const [cidadeFiltro, setCidadeFiltro] = useState(search.cidade ?? "Todas");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCategoria(search.categoria ?? "Todas");
    setQuery(search.q ?? "");
    setCidadeFiltro(search.cidade ?? "Todas");
  }, [search.categoria, search.q, search.cidade]);

  useEffect(() => {
    void (async () => {
      setAnuncios(await loadAnuncios());
      setLoading(false);
    })();
  }, []);

  const publicados = anuncios.filter((a) => a.ativo);
  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    return publicados.filter((a) => {
      const matchCategoria = categoria === "Todas" ? true : categoria === "24h" ? Boolean(a.atendimento24h) : a.categoria === categoria;
      const texto = `${a.titulo} ${a.categoria} ${a.subcategoria} ${a.descricao} ${a.cidade}`.toLowerCase();
      const matchQuery = !q || texto.includes(q);
      const matchCidade = cidadeFiltro === "Todas" || a.cidade === cidadeFiltro;
      return matchCategoria && matchQuery && matchCidade;
    });
  }, [publicados, categoria, query, cidadeFiltro]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="border-b border-border/60 bg-gradient-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Voltar ao início
          </Link>
          <div className="mt-6 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Encontrar serviços
            </span>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-6xl">
              Profissionais anunciados no Casalar
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Escolha uma categoria ou pesquise pelo serviço que você precisa.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-border bg-card p-2 shadow-soft md:flex-row md:items-center">
            <div className="flex flex-1 items-center gap-3 px-3 py-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Buscar por limpeza, babá, encanador..."
                className="w-full bg-transparent text-base placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {["Todas", "24h", ...CATEGORIAS].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategoria(c)}
                  className={`rounded-full border px-4 py-2 text-sm transition-all ${
                    categoria === c
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm shadow-soft">
              <MapPin className="h-4 w-4 text-primary" />
              <select
                value={cidadeFiltro}
                onChange={(e) => setCidadeFiltro(e.target.value)}
                className="bg-transparent outline-none"
              >
                <option value="Todas">Todas as cidades</option>
                {CIDADES_ATENDIDAS.map((cidade) => (
                  <option key={cidade} value={cidade}>{cidade}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl font-semibold">
            {categoria === "Todas" ? "Todos os serviços" : categoria === "24h" ? "Atendimento 24h" : categoria}
          </h2>
          <p className="text-sm text-muted-foreground">
            {loading ? "Carregando..." : `${filtrados.length} anúncio(s)`}
          </p>
        </div>

        {loading ? null : filtrados.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card/40 p-12 text-center">
            <h3 className="font-display text-2xl font-semibold">Nenhum anúncio encontrado</h3>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              Ainda não há profissionais publicados nessa busca. Tente outra categoria ou anuncie um serviço.
            </p>
            <Link to="/cadastro/prestador" className="mt-6 inline-flex rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background">
              Anunciar serviço
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtrados.map((a) => <PublicCard key={a.id} anuncio={a} />)}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function PublicCard({ anuncio }: { anuncio: Anuncio }) {
  const media = getAvaliacaoMedia(anuncio);
  const qtdAvaliacoes = anuncio.avaliacaoQtd ?? 0;
  const CASALAR_WHATSAPP = "5519997719640";
  const contato = encodeURIComponent(`Olá, vim pelo Casalar. Tenho interesse no serviço: ${anuncio.titulo}. Categoria: ${anuncio.categoria}${anuncio.subcategoria ? ` - ${anuncio.subcategoria}` : ""}. Cidade: ${anuncio.cidade || "não informada"}. Valor: ${anuncio.preco ? `R$ ${anuncio.preco} / ${anuncio.unidade}` : "a combinar"}.`);
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-shadow hover:shadow-warm">
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{anuncio.categoria}</span>
            {anuncio.subcategoria && <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">{anuncio.subcategoria}</span>}
            {anuncio.atendimento24h && <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">24h</span>}
          </div>
          {qtdAvaliacoes > 0 && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
              <Star className="h-3.5 w-3.5 fill-current" />
              {media.toFixed(1)}
              <span className="font-normal text-amber-700/70">({qtdAvaliacoes})</span>
            </span>
          )}
        </div>
        <h3 className="font-display text-xl font-semibold leading-tight">{anuncio.titulo}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{anuncio.descricao || "Profissional disponível para atendimento."}</p>
        <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
          <Meta icon={DollarSign}>{anuncio.preco ? `R$ ${anuncio.preco} / ${anuncio.unidade}` : "Valor a combinar"}</Meta>
          <Meta icon={MapPin}>{anuncio.cidade ? `${anuncio.cidade} · até ${anuncio.raio} km` : "Localização a combinar"}</Meta>
          <Meta icon={anuncio.atendimento24h ? Clock : Calendar}>{anuncio.atendimento24h ? "Atendimento 24h" : `${anuncio.horarioInicio}–${anuncio.horarioFim}`}</Meta>
        </div>
        <a
          href={`https://wa.me/${CASALAR_WHATSAPP}?text=${contato}`}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
        >
          Solicitar atendimento
        </a>
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
