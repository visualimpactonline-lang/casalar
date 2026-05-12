-- Rode este SQL no Supabase em SQL Editor.
create table if not exists public.anuncios (
  id text primary key,
  titulo text not null default '',
  categoria text not null default '',
  subcategoria text not null default '',
  descricao text not null default '',
  preco text not null default '',
  unidade text not null default 'hora',
  cidade text not null default '',
  raio text not null default '10',
  dias_atendidos text[] not null default '{}',
  horario_inicio text not null default '08:00',
  horario_fim text not null default '18:00',
  ativo boolean not null default true,
  criado_em bigint not null default (extract(epoch from now()) * 1000)::bigint,
  prestador_email text not null default '',
  prestador_senha text not null default '',
  prestador_telefone text not null default ''
);

alter table public.anuncios enable row level security;

drop policy if exists "Todos podem ver anúncios" on public.anuncios;
create policy "Todos podem ver anúncios"
on public.anuncios for select
using (true);

drop policy if exists "Todos podem criar anúncios" on public.anuncios;
create policy "Todos podem criar anúncios"
on public.anuncios for insert
with check (true);

drop policy if exists "Todos podem editar anúncios" on public.anuncios;
create policy "Todos podem editar anúncios"
on public.anuncios for update
using (true)
with check (true);

drop policy if exists "Todos podem remover anúncios" on public.anuncios;
create policy "Todos podem remover anúncios"
on public.anuncios for delete
using (true);


-- Se você já criou a tabela antes, estas linhas adicionam os campos novos sem apagar nada.
alter table public.anuncios add column if not exists prestador_email text not null default '';
alter table public.anuncios add column if not exists prestador_senha text not null default '';
alter table public.anuncios add column if not exists prestador_telefone text not null default '';

-- A coluna fotos não é mais usada pelo site. Se ela existir no banco, pode ficar lá sem problema.

-- Avaliações dos prestadores (média calculada no site: avaliacao_soma / avaliacao_qtd).
alter table public.anuncios add column if not exists avaliacao_soma numeric not null default 0;
alter table public.anuncios add column if not exists avaliacao_qtd integer not null default 0;
