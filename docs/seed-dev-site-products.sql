-- ============================================================
-- SEED DE TESTE — site_products (APENAS DEV)
-- ============================================================
-- Dados de TESTE para validar visualmente a vitrine dinâmica.
-- NÃO é conteúdo real. Rodar no SQL Editor do Supabase DEV
-- (projeto yjemkvuaayakvldsszjr). NÃO rodar em produção.
--
-- Reproduz os 5 cards que antes eram hardcoded na home, agora
-- vindos do banco. Todos is_visible=true e is_featured=true.
-- ============================================================

insert into site_products
  (slug, name, brand, volume_label, short_description, full_description,
   price, category, is_visible, is_featured, display_order,
   background_variant, badge_tag, fragrance_notes)
values
  ('yara-eau-de-parfum', 'Yara Eau de Parfum', 'Lattafa', '100ml',
   'Floral adocicado que fica na pele o dia inteiro. O perfume árabe feminino mais pedido do Brasil — quem experimenta, repete.',
   'Floral adocicado que fica na pele o dia inteiro. O perfume árabe feminino mais pedido do Brasil — quem experimenta, repete. Alta fixação e projeção, ideal para o dia a dia e para ocasiões especiais.',
   119.90, 'árabe', true, true, 1, 'escuro', 'Mais vendido',
   array['Frutas tropicais', 'Baunilha', 'Almíscar']),

  ('club-de-nuit-intense-man', 'Club de Nuit Intense Man', 'Armaf', '105ml',
   'Amadeirado cítrico com projeção que ninguém ignora. Referência no Creed Aventus por uma fração do preço.',
   'Amadeirado cítrico com projeção que ninguém ignora. Referência no Creed Aventus por uma fração do preço. Um dos árabes masculinos mais versáteis e elogiados.',
   149.90, 'árabe', true, true, 2, 'claro', null,
   array['Abacaxi', 'Bergamota', 'Baunilha amadeirada']),

  ('asad-eau-de-parfum', 'Asad Eau de Parfum', 'Lattafa', '100ml',
   'Especiado amadeirado com fixação absurda. O favorito masculino de quem gosta de presença e elogios.',
   'Especiado amadeirado com fixação absurda. O favorito masculino de quem gosta de presença e elogios. Perfeito para a noite e para o clima do Nordeste.',
   99.90, 'árabe', true, true, 3, 'escuro', null,
   array['Pimenta', 'Âmbar', 'Madeira']),

  ('hidratante-corporal-nivea', 'Hidratante corporal', 'Nivea', '400ml',
   'Hidratação profunda que dura o dia todo mesmo no calor. A marca que todo mundo confia.',
   'Hidratação profunda que dura o dia todo mesmo no calor. A marca que todo mundo confia. Textura leve, absorção rápida, sem sensação pegajosa.',
   38.90, 'cosmético', true, true, 4, 'creme', null,
   null),

  ('creme-para-cachos-salon-line', 'Creme para cachos', 'Salon Line', '500ml',
   'Definição e hidratação pra quem tem cachos. A marca que o Nordeste mais usa e aprova.',
   'Definição e hidratação pra quem tem cachos. A marca que o Nordeste mais usa e aprova. Pode usar no cabelo molhado ou seco, sem pesar.',
   32.90, 'cosmético', true, true, 5, 'claro', null,
   null);

-- Conferência rápida:
-- select slug, name, is_visible, is_featured, display_order from site_products order by display_order;
