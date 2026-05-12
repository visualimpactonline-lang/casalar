import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, Sparkles, ShieldCheck, Star, ArrowRight, Wrench, Brush, Zap, Trees, Hammer, Truck, BookOpen, Baby } from "lucide-react";
import heroImg from "@/assets/hero-services.jpg";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CATEGORIAS_TREE } from "@/lib/anuncios-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Casalar" },
      { name: "description", content: "Encontre profissionais de confiança para cuidar da sua casa, ou anuncie seu serviço para milhares de clientes." },
      { property: "og:title", content: "Casalar" },
      { property: "og:description", content: "Diaristas, eletricistas, encanadores, jardineiros e mais. Tudo num só lugar." },
    ],
  }),
  component: Index,
});

const ICONES: Record<string, typeof Brush> = {
  Limpeza: Brush,
  Elétrica: Zap,
  Encanamento: Wrench,
  Jardinagem: Trees,
  Reformas: Hammer,
  Mudanças: Truck,
  Aulas: BookOpen,
  Cuidadores: Baby,
};

const categorias = (Object.keys(CATEGORIAS_TREE) as Array<keyof typeof CATEGORIAS_TREE>).map((label) => ({
  label,
  icon: ICONES[label] ?? Sparkles,
  subs: CATEGORIAS_TREE[label],
}));

function Index() {
  const navigate = useNavigate();
  const [buscaHero, setBuscaHero] = useState("");

  const buscarServico = () => {
    const termo = buscaHero.trim();
    navigate({ to: "/servicos", search: termo ? { q: termo } : {} });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-cream" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-16 md:grid-cols-2 md:gap-16 md:px-8 md:pb-28 md:pt-24">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Mais de 12 mil profissionais cadastrados
            </span>

            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] text-balance md:text-7xl">
              O cuidado da sua casa,{" "}
              <span className="italic text-primary">em boas mãos.</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg text-muted-foreground text-balance">
              Encontre diaristas, eletricistas, encanadores e muito mais. Profissionais avaliados, perto de você.
            </p>

            {/* Search */}
            <form
              className="mt-8 flex flex-col gap-3 rounded-2xl border border-border bg-card p-2 shadow-soft sm:flex-row sm:items-center"
              onSubmit={(event) => {
                event.preventDefault();
                buscarServico();
              }}
            >
              <div className="flex flex-1 items-center gap-3 px-3 py-2">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  id="hero-search"
                  type="search"
                  value={buscaHero}
                  onChange={(event) => setBuscaHero(event.currentTarget.value)}
                  placeholder="Que serviço você precisa?"
                  autoComplete="off"
                  inputMode="search"
                  className="w-full bg-transparent text-base placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]"
              >
                Buscar
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Profissionais verificados
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-accent text-accent" />
                4,9 média de avaliação
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-warm opacity-20 blur-3xl" aria-hidden />
            <img
              src={heroImg}
              alt="Profissionais de serviços domésticos sorrindo enquanto trabalham"
              width={1280}
              height={1280}
              className="relative aspect-square w-full rounded-[2rem] object-cover shadow-warm"
            />
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-card p-4 shadow-warm md:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold leading-none">4,9</p>
                  <p className="text-xs text-muted-foreground">+ 38 mil avaliações</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section id="categorias" className="border-y border-border/60 bg-card/40 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-primary">Categorias</p>
              <h2 className="mt-2 font-display text-3xl font-semibold md:text-5xl">
                O que você precisa hoje?
              </h2>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categorias.map(({ icon: Icon, label, subs }) => (
              <Link
                key={label}
                to="/servicos"
                search={{ categoria: label }}
                className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="font-display text-lg font-semibold">{label}</p>
                </div>
                <ul className="flex flex-wrap gap-1.5">
                  {subs.map((s) => (
                    <li key={s}>
                      <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:text-foreground">
                        {s}
                      </span>
                    </li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">Como funciona</p>
            <h2 className="mt-2 font-display text-3xl font-semibold md:text-5xl text-balance">
              Simples como deveria ser.
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { n: "01", t: "Diga o que precisa", d: "Escolha a categoria e descreva o serviço em poucos segundos." },
              { n: "02", t: "Receba propostas", d: "Profissionais qualificados perto de você entram em contato." },
              { n: "03", t: "Contrate com calma", d: "Compare avaliações, converse e escolha quem cuidará da sua casa." },
            ].map((s) => (
              <div key={s.n} className="relative rounded-3xl border border-border bg-card p-8 transition-shadow hover:shadow-soft">
                <span className="font-display text-5xl font-semibold text-primary/30">{s.n}</span>
                <h3 className="mt-4 font-display text-2xl font-semibold">{s.t}</h3>
                <p className="mt-2 text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARA PRESTADORES */}
      <section id="prestadores" className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-x-4 inset-y-0 rounded-[2.5rem] bg-gradient-warm md:inset-x-8" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-8 py-12 md:grid-cols-2 md:gap-16 md:p-20">
          <div className="text-primary-foreground">
            <p className="text-sm font-medium uppercase tracking-widest opacity-80">Para prestadores</p>
            <h2 className="mt-2 font-display text-4xl font-semibold md:text-6xl text-balance">
              Seu trabalho merece ser encontrado.
            </h2>
            <p className="mt-6 max-w-md text-lg opacity-90">
              Crie um perfil em minutos, receba pedidos de clientes na sua região e cresça com avaliações reais.
            </p>
            <Link
              to="/cadastro/prestador"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-medium text-foreground transition-transform hover:scale-[1.02]"
            >
              Anunciar meu serviço
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 self-center">
            {[
              { t: "Sem mensalidade", d: "Comece de graça e pague só quando crescer." },
              { t: "Clientes na sua região", d: "Receba pedidos de quem está perto de você." },
              { t: "Construa sua reputação", d: "Avaliações reais que fazem você se destacar." },
            ].map((b) => (
              <div key={b.t} className="rounded-2xl bg-background/95 p-5 backdrop-blur">
                <p className="font-display text-xl font-semibold">{b.t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
