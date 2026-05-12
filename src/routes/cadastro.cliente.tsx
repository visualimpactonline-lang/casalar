import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, MapPin, User, Search } from "lucide-react";

export const Route = createFileRoute("/cadastro/cliente")({
  head: () => ({
    meta: [
      { title: "Sou cliente — Casalar" },
      { name: "description", content: "Crie sua conta gratuita e encontre profissionais para cuidar da sua casa." },
    ],
  }),
  component: ClienteOnboarding,
});

const STEPS = ["Você", "Localização", "Necessidade"] as const;

const necessidades = ["Limpeza", "Elétrica", "Encanamento", "Jardinagem", "Reformas", "Mudanças", "Aulas", "Cuidadores"];

function ClienteOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [interesses, setInteresses] = useState<string[]>([]);

  const toggle = (n: string) =>
    setInteresses((prev) => (prev.includes(n) ? prev.filter((p) => p !== n) : [...prev, n]));

  const canNext =
    (step === 0 && nome.trim() && email.trim()) ||
    (step === 1 && cidade.trim() && bairro.trim()) ||
    (step === 2 && interesses.length > 0);

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else navigate({ to: "/" });
  };

  return (
    <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:gap-16">
      {/* Side panel */}
      <aside className="hidden flex-col justify-between rounded-3xl bg-foreground p-10 text-background md:flex">
        <div>
          <span className="inline-flex items-center rounded-full border border-background/20 px-3 py-1 text-xs">
            Sou cliente
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight">
            Encontre quem cuida da sua casa como você cuidaria.
          </h1>
          <p className="mt-4 text-background/70">
            Em três passos rápidos você já pode receber propostas de profissionais avaliados.
          </p>
        </div>

        <ul className="space-y-4">
          {STEPS.map((s, i) => (
            <li key={s} className="flex items-center gap-3 text-sm">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs ${
                  i <= step ? "border-primary bg-primary text-primary-foreground" : "border-background/30 text-background/60"
                }`}
              >
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span className={i <= step ? "" : "text-background/60"}>{s}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Form */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-10">
        <div className="mb-8 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Passo {step + 1} de {STEPS.length}
          </p>
          <Link to="/cadastro/prestador" className="text-sm text-primary hover:underline">
            Sou prestador
          </Link>
        </div>

        {/* Progress */}
        <div className="mb-8 flex gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>

        {step === 0 && (
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <User className="h-3.5 w-3.5" />
              Seus dados
            </div>
            <h2 className="font-display text-3xl font-semibold">Como podemos te chamar?</h2>
            <p className="mt-2 text-muted-foreground">Vamos personalizar sua experiência.</p>

            <div className="mt-8 space-y-5">
              <Field label="Nome completo">
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Maria Silva"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </Field>
              <Field label="E-mail">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="[email protected]"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </Field>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <MapPin className="h-3.5 w-3.5" />
              Localização
            </div>
            <h2 className="font-display text-3xl font-semibold">Onde você mora?</h2>
            <p className="mt-2 text-muted-foreground">Para mostrar profissionais perto de você.</p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <Field label="Cidade">
                <input
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  placeholder="São Paulo"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </Field>
              <Field label="Bairro">
                <input
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  placeholder="Vila Mariana"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </Field>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Search className="h-3.5 w-3.5" />
              Interesses
            </div>
            <h2 className="font-display text-3xl font-semibold">Que tipo de serviço você procura?</h2>
            <p className="mt-2 text-muted-foreground">Escolha uma ou mais categorias.</p>

            <div className="mt-8 flex flex-wrap gap-2">
              {necessidades.map((n) => {
                const active = interesses.includes(n);
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => toggle(n)}
                    className={`rounded-full border px-4 py-2 text-sm transition-all ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:border-primary/40"
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={next}
            disabled={!canNext}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-soft transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {step === STEPS.length - 1 ? "Concluir" : "Continuar"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="block">
      <span className="mb-2 block text-sm font-medium text-foreground">{label}</span>
      {children}
    </div>
  );
}
