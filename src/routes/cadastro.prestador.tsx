import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, Briefcase, MapPin, Wrench, DollarSign, Clock } from "lucide-react";
import { CATEGORIAS, CIDADES_ATENDIDAS, getSubcategorias, isCidadeAtendida, normalizeCidadeAtendida, type Anuncio, upsertAnuncio } from "@/lib/anuncios-store";

export const Route = createFileRoute("/cadastro/prestador")({
  head: () => ({
    meta: [
      { title: "Anuncie seu serviço — Casalar" },
      { name: "description", content: "Crie seu perfil profissional gratuito e receba clientes na sua região." },
    ],
  }),
  component: PrestadorOnboarding,
});

const STEPS = ["Sobre você", "Especialidade", "Atendimento", "Horários", "Preços"] as const;
const categorias = CATEGORIAS;

function PrestadorOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [categoria, setCategoria] = useState("");
  const [subcategoriasSelecionadas, setSubcategoriasSelecionadas] = useState<string[]>([]);
  const [experiencia, setExperiencia] = useState("");
  const [cidade, setCidade] = useState("");
  const [raio, setRaio] = useState("10");
  const [preco, setPreco] = useState("");
  const [unidade, setUnidade] = useState("hora");
  const [atendimento24h, setAtendimento24h] = useState(false);
  const [horarioInicio, setHorarioInicio] = useState("08:00");
  const [horarioFim, setHorarioFim] = useState("18:00");

  const subcategorias = getSubcategorias(categoria);

  const canNext =
    (step === 0 && nome.trim() && telefone.trim() && bio.trim() && email.trim() && senha.trim()) ||
    (step === 1 && categoria && subcategoriasSelecionadas.length > 0 && experiencia) ||
    (step === 2 && isCidadeAtendida(cidade)) ||
    step === 3 ||
    (step === 4 && preco.trim());

  const next = async () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }

    const novoAnuncio: Anuncio = {
      id: crypto.randomUUID(),
      titulo: `${subcategoriasSelecionadas[0] || categoria} - ${nome}`.trim(),
      categoria,
      subcategoria: subcategoriasSelecionadas.join(", "),
      descricao: bio,
      preco,
      unidade: unidade as Anuncio["unidade"],
      cidade: normalizeCidadeAtendida(cidade),
      raio,
      diasAtendidos: ["seg", "ter", "qua", "qui", "sex"],
      atendimento24h,
      horarioInicio: atendimento24h ? "00:00" : horarioInicio,
      horarioFim: atendimento24h ? "23:59" : horarioFim,
      ativo: true,
      criadoEm: Date.now(),
      prestadorEmail: email.trim().toLowerCase(),
      prestadorSenha: senha.trim(),
      prestadorTelefone: telefone.trim(),
    };

    await upsertAnuncio(novoAnuncio);
    window.localStorage.setItem("casalar:prestador:email", email.trim().toLowerCase());
    navigate({ to: "/servicos", search: { categoria } });
  };

  return (
    <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:gap-16">
      <aside className="hidden flex-col justify-between rounded-3xl bg-gradient-warm p-10 text-primary-foreground md:flex">
        <div>
          <span className="inline-flex items-center rounded-full border border-primary-foreground/30 px-3 py-1 text-xs">
            Sou prestador
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight">
            Mostre seu trabalho para quem precisa dele.
          </h1>
          <p className="mt-4 text-primary-foreground/80">
            Sem mensalidade. Você cria seu perfil, recebe pedidos e cresce com avaliações reais.
          </p>
        </div>

        <ul className="space-y-4">
          {STEPS.map((s, i) => (
            <li key={s} className="flex items-center gap-3 text-sm">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs ${
                  i <= step
                    ? "border-primary-foreground bg-primary-foreground text-primary"
                    : "border-primary-foreground/30 text-primary-foreground/60"
                }`}
              >
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span className={i <= step ? "" : "text-primary-foreground/60"}>{s}</span>
            </li>
          ))}
        </ul>
      </aside>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-10">
        <div className="mb-8 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Passo {step + 1} de {STEPS.length}
          </p>
          <Link to="/cadastro/cliente" className="text-sm text-primary hover:underline">
            Sou cliente
          </Link>
        </div>

        <div className="mb-8 flex gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>

        {step === 0 && (
          <Section icon={Briefcase} tag="Seu perfil" title="Vamos te apresentar.">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nome completo">
                <Input value={nome} onChange={setNome} placeholder="João Pereira" />
              </Field>
              <Field label="Telefone / WhatsApp">
                <Input value={telefone} onChange={setTelefone} placeholder="(11) 99999-0000" />
              </Field>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="E-mail"><Input type="email" value={email} onChange={setEmail} placeholder="voce@email.com" /></Field>
              <Field label="Senha"><Input type="password" value={senha} onChange={setSenha} placeholder="********" /></Field>
            </div>
            <Field label="Conte um pouco sobre você">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Ex: Eletricista há 8 anos, atendimento residencial e comercial, pontual e organizado."
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </Field>
          </Section>
        )}

        {step === 1 && (
          <Section icon={Wrench} tag="Especialidade" title="No que você é especialista?">
            <Field label="Categoria principal">
              <div className="flex flex-wrap gap-2">
                {categorias.map((c) => {
                  const active = categoria === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setCategoria(c);
                        setSubcategoriasSelecionadas([]);
                      }}
                      className={`rounded-full border px-4 py-2 text-sm transition-all ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:border-primary/40"
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </Field>
            {categoria && (
              <Field label={`Especialidades (${subcategoriasSelecionadas.length}/5 selecionadas)`}>
                <p className="mb-3 text-xs text-muted-foreground">
                  Escolha até 5 serviços que você realmente faz.
                </p>
                <div className="flex flex-wrap gap-2">
                  {subcategorias.map((s) => {
                    const active = subcategoriasSelecionadas.includes(s);
                    const atingiuLimite = subcategoriasSelecionadas.length >= 5;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          if (active) {
                            setSubcategoriasSelecionadas((atuais) => atuais.filter((item) => item !== s));
                            return;
                          }

                          if (!atingiuLimite) {
                            setSubcategoriasSelecionadas((atuais) => [...atuais, s]);
                          }
                        }}
                        disabled={!active && atingiuLimite}
                        className={`rounded-full border px-4 py-2 text-sm transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                          active
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background hover:border-primary/40"
                        }`}
                      >
                        {active ? `✓ ${s}` : s}
                      </button>
                    );
                  })}
                </div>
              </Field>
            )}
            <Field label="Tempo de experiência">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {["Menos de 1 ano", "1 a 3 anos", "3 a 5 anos", "Mais de 5 anos"].map((e) => {
                  const active = experiencia === e;
                  return (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setExperiencia(e)}
                      className={`rounded-xl border px-3 py-3 text-sm transition-all ${
                        active
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border bg-background hover:border-primary/40"
                      }`}
                    >
                      {e}
                    </button>
                  );
                })}
              </div>
            </Field>
          </Section>
        )}

        {step === 2 && (
          <Section icon={MapPin} tag="Atendimento" title="Onde você atende?">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Cidade base">
                <div className="space-y-2">
                  <input
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    onBlur={() => {
                      if (isCidadeAtendida(cidade)) setCidade(normalizeCidadeAtendida(cidade));
                    }}
                    list="cidades-atendidas"
                    placeholder="Digite e escolha uma cidade"
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <datalist id="cidades-atendidas">
                    {CIDADES_ATENDIDAS.map((item) => (
                      <option key={item} value={item} />
                    ))}
                  </datalist>
                  {cidade.trim() && !isCidadeAtendida(cidade) && (
                    <p className="text-xs text-primary">Escolha uma das cidades disponíveis na lista.</p>
                  )}
                </div>
              </Field>
              <Field label="Raio de atendimento">
                <select
                  value={raio}
                  onChange={(e) => setRaio(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="5">Até 5 km</option>
                  <option value="10">Até 10 km</option>
                  <option value="20">Até 20 km</option>
                  <option value="50">Até 50 km</option>
                  <option value="999">Cidade inteira</option>
                </select>
              </Field>
            </div>
          </Section>
        )}

        {step === 3 && (
          <Section icon={Clock} tag="Horários" title="Quando você atende?">
            <div className="space-y-5">
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all ${
                  atendimento24h ? "border-primary bg-primary/5" : "border-border bg-background hover:border-primary/40"
                }`}
              >
                <input
                  type="checkbox"
                  checked={atendimento24h}
                  onChange={(e) => setAtendimento24h(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-primary"
                />
                <span>
                  <span className="block font-medium text-foreground">Atendimento 24 horas</span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    Marque essa opção se você aceita chamados a qualquer hora do dia.
                  </span>
                </span>
              </label>

              {!atendimento24h && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Início do atendimento">
                    <input
                      type="time"
                      value={horarioInicio}
                      onChange={(e) => setHorarioInicio(e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </Field>
                  <Field label="Fim do atendimento">
                    <input
                      type="time"
                      value={horarioFim}
                      onChange={(e) => setHorarioFim(e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </Field>
                </div>
              )}

              <div className="rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
                💡 Profissionais 24h aparecem no filtro especial de urgência para clientes.
              </div>
            </div>
          </Section>
        )}

        {step === 4 && (
          <Section icon={DollarSign} tag="Preços" title="Como você cobra?">
            <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
              <Field label="Valor a partir de">
                <div className="flex items-center rounded-xl border border-input bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                  <span className="pl-4 text-muted-foreground">R$</span>
                  <input
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    placeholder="80"
                    inputMode="numeric"
                    className="w-full bg-transparent px-3 py-3 text-base focus:outline-none"
                  />
                </div>
              </Field>
              <Field label="Unidade">
                <select
                  value={unidade}
                  onChange={(e) => setUnidade(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="hora">por hora</option>
                  <option value="diaria">por diária</option>
                  <option value="visita">por visita</option>
                  <option value="orcamento">sob orçamento</option>
                </select>
              </Field>
            </div>
            <div className="rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
              💡 Dica: você poderá ajustar valores depois e oferecer pacotes personalizados.
            </div>
          </Section>
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
            {step === STEPS.length - 1 ? "Publicar perfil" : "Continuar"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({
  icon: Icon,
  tag,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Icon className="h-3.5 w-3.5" />
          {tag}
        </div>
        <h2 className="font-display text-3xl font-semibold">{title}</h2>
      </div>
      {children}
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

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
    />
  );
}
