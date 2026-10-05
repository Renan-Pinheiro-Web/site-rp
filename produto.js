/* ============================================================
   produto.js — página de detalhe do produto
   ============================================================
   Lê o slug da URL (rota limpa /produto/slug via rewrite do Netlify,
   com fallback ?slug=...), busca o site_product visível + galeria,
   renderiza galeria/nome/preço/descrição/WhatsApp e relacionados da
   mesma categoria. Produto inexistente ou não visível -> mensagem
   amigável (o RLS já esconde invisíveis: a busca volta vazia).
   ============================================================ */

(function () {
  var main = document.getElementById('produtoMain');

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function fmtPreco(n) {
    return 'R$ ' + Number(n).toFixed(2).replace('.', ',');
  }

  // slug: /produto/<slug> (pathname) ou ?slug=<slug> (fallback)
  function getSlug() {
    var q = new URLSearchParams(location.search).get('slug');
    if (q) return q;
    var m = location.pathname.match(/\/produto\/([^/?#]+)/);
    return m ? decodeURIComponent(m[1]) : '';
  }

  function variantClass(v) {
    if (v === 'claro') return 'produto-img--claro';
    if (v === 'creme') return 'produto-img--creme';
    return 'produto-img--escuro';
  }

  function iconeFrasco(variant) {
    var stroke = variant === 'claro' ? 'rgba(44,36,32,.35)'
      : variant === 'creme' ? 'rgba(139,111,78,.35)'
      : 'rgba(232,213,192,.5)';
    return '<svg class="produto-icon" aria-hidden="true" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="' + stroke + '" stroke-width="1">' +
      '<path d="M12 2c-1.5 0-3 .6-3 2.2v2h6v-2C15 2.6 13.5 2 12 2z"/>' +
      '<path d="M8 6.2v11c0 2.8 1.5 4.6 4 4.6s4-1.8 4-4.6v-11"/></svg>';
  }

  function erro() {
    document.title = 'Produto não encontrado — Essenza';
    main.innerHTML =
      '<section class="pd-erro"><div class="container">' +
        '<h1>Produto não encontrado</h1>' +
        '<p>Este produto não está disponível ou o link está incorreto.</p>' +
        '<a href="/#produtos" class="cta cta--wpp">Ver destaques</a>' +
      '</div></section>';
  }

  function galeriaHTML(p, imgs) {
    var variant = p.background_variant || 'escuro';
    var principal = imgs.length
      ? '<img id="pdMainImg" src="' + esc(imgs[0].image_url) + '" alt="' + esc(p.name) + '" class="produto-foto">'
      : iconeFrasco(variant);

    var thumbs = '';
    if (imgs.length > 1) {
      thumbs = '<div class="pd-thumbs">' + imgs.map(function (im, i) {
        return '<button class="pd-thumb' + (i === 0 ? ' active' : '') + '" data-src="' + esc(im.image_url) + '" aria-label="Foto ' + (i + 1) + '">' +
          '<img src="' + esc(im.image_url) + '" alt="" loading="lazy"></button>';
      }).join('') + '</div>';
    }

    return '<div class="pd-galeria">' +
      '<div class="pd-main ' + variantClass(variant) + '">' + principal + '</div>' +
      thumbs +
    '</div>';
  }

  function infoHTML(p) {
    var marca = p.brand ? '<span class="produto-marca">' + esc(p.brand) + '</span>' : '';
    var vol = p.volume_label ? '<span class="produto-vol">' + esc(p.volume_label) + '</span>' : '';
    var notas = '';
    if (Array.isArray(p.fragrance_notes) && p.fragrance_notes.length) {
      notas = '<div class="produto-notas">' +
        p.fragrance_notes.map(function (n) { return '<span>' + esc(n) + '</span>'; }).join('') + '</div>';
    }
    var desc = p.full_description || p.short_description || '';
    return '<div class="pd-info">' +
      marca +
      '<h1>' + esc(p.name) + '</h1>' +
      vol +
      '<div class="pd-preco">' + fmtPreco(p.price) + '</div>' +
      (desc ? '<p class="pd-desc">' + esc(desc) + '</p>' : '') +
      notas +
      '<a href="' + esc(wppLinkProduto(p.name)) + '" class="cta cta--wpp cta--lg" target="_blank" rel="noopener">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.616l4.529-1.472A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>' +
        'Quero esse' +
      '</a>' +
    '</div>';
  }

  function relacionadosHTML(itens) {
    if (!itens.length) return '';
    var cards = itens.map(function (p) {
      var variant = p.background_variant || 'escuro';
      var href = '/produto/' + encodeURIComponent(p.slug);
      var foto = p._foto
        ? '<img src="' + esc(p._foto) + '" alt="' + esc(p.name) + '" class="produto-foto" loading="lazy">'
        : iconeFrasco(variant);
      var marca = p.brand ? '<span class="produto-marca">' + esc(p.brand) + '</span>' : '';
      return '<article class="produto" data-href="' + esc(href) + '">' +
        '<a class="produto-img ' + variantClass(variant) + '" href="' + esc(href) + '" aria-label="' + esc(p.name) + '">' + foto + '</a>' +
        '<div class="produto-info">' + marca +
          '<h3><a href="' + esc(href) + '">' + esc(p.name) + '</a></h3>' +
          '<div class="produto-bottom"><span class="produto-preco">' + fmtPreco(p.price) + '</span></div>' +
        '</div></article>';
    }).join('');
    return '<section class="section pd-relacionados"><div class="container">' +
      '<h2 class="section-title">Você também pode gostar</h2>' +
      '<div class="grid-produtos">' + cards + '</div>' +
    '</div></section>';
  }

  function render(p, imgs) {
    document.title = p.name + ' — Essenza';
    var meta = document.querySelector('meta[name="description"]');
    if (meta && p.short_description) meta.setAttribute('content', p.short_description);

    main.innerHTML =
      '<section class="pd-top"><div class="container">' +
        '<a href="/#produtos" class="pd-voltar">&larr; Voltar</a>' +
        '<div class="pd-layout">' + galeriaHTML(p, imgs) + infoHTML(p) + '</div>' +
      '</div></section>' +
      '<div id="pdRelacionados"></div>';

    // troca da imagem principal pelos thumbs
    var mainImg = document.getElementById('pdMainImg');
    document.querySelectorAll('.pd-thumb').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!mainImg) return;
        mainImg.src = btn.getAttribute('data-src');
        document.querySelectorAll('.pd-thumb').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
      });
    });

    carregarRelacionados(p);
  }

  function carregarRelacionados(p) {
    var slot = document.getElementById('pdRelacionados');
    if (!slot) return;
    sbSelect('/site_products?select=slug,name,price,brand,background_variant,site_product_images(image_url,display_order)&is_visible=eq.true&category=eq.' +
      encodeURIComponent(p.category) + '&slug=neq.' + encodeURIComponent(p.slug) + '&order=display_order.asc&limit=4')
      .then(function (rows) {
        rows.forEach(function (r) {
          var imgs = (r.site_product_images || []).slice().sort(function (a, b) {
            return (a.display_order || 0) - (b.display_order || 0);
          });
          r._foto = imgs.length ? imgs[0].image_url : null;
        });
        slot.innerHTML = relacionadosHTML(rows);
        slot.querySelectorAll('.produto[data-href]').forEach(function (card) {
          card.addEventListener('click', function (e) {
            if (e.target.closest('a')) return;
            window.location.href = card.getAttribute('data-href');
          });
        });
      })
      .catch(function () { /* relacionados são opcionais; silêncio se falhar */ });
  }

  var slug = getSlug();
  if (!slug) { erro(); return; }

  sbSelect('/site_products?select=*,site_product_images(image_url,display_order)&is_visible=eq.true&slug=eq.' +
    encodeURIComponent(slug) + '&limit=1')
    .then(function (rows) {
      if (!rows.length) { erro(); return; }
      var p = rows[0];
      var imgs = (p.site_product_images || []).slice().sort(function (a, b) {
        return (a.display_order || 0) - (b.display_order || 0);
      });
      render(p, imgs);
    })
    .catch(function (err) {
      console.error('[produto] falha:', err);
      erro();
    });
})();
