# Casalar — pronto para Vercel

## O que foi ajustado

- O botão `Painel` do topo virou `Encontrar serviços`.
- O link `Encontrar serviços` do rodapé agora abre a página pública `/servicos`.
- As categorias da home agora são clicáveis e filtram os profissionais anunciados.
- Foi criada a página `/servicos`, com busca, filtros por categoria e cards dos profissionais publicados.
- O cadastro de anúncios agora usa Supabase quando as variáveis de ambiente estão configuradas. Sem Supabase, o site continua funcionando com `localStorage`, mas nesse modo os anúncios ficam salvos apenas no dispositivo usado.
- Foi adicionado `vercel.json` para deploy na Vercel como app estático com fallback para rotas.

## Para anúncios aparecerem em todos os dispositivos

1. Crie um projeto no Supabase.
2. Abra o `SQL Editor` e rode o conteúdo de `SUPABASE_SETUP.sql`.
3. No Vercel, configure estas variáveis em `Settings > Environment Variables`:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_PUBLIC
VITE_SUPABASE_TABLE=anuncios
```

4. Faça o deploy novamente.

## Deploy na Vercel

- Build command: `npm run build`
- Output directory: `dist/client`

O arquivo `vercel.json` já deixa isso configurado.
