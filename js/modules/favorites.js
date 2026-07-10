/**
 * 收藏管理模块
 */
const Favorites = (() => {
  const STORAGE_KEY = 'mimi_favorites';

  function get() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch { return []; }
  }

  function save(ids) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    updateBadge();
  }

  function has(productId) {
    return get().includes(productId);
  }

  function toggle(productId) {
    let favs = get();
    if (favs.includes(productId)) {
      favs = favs.filter(id => id !== productId);
    } else {
      favs.push(productId);
    }
    save(favs);
    // 重新渲染当前视图
    App.refreshCurrentView();
  }

  function count() {
    return get().length;
  }

  function updateBadge() {
    const badge = document.getElementById('fav-count');
    if (badge) {
      const c = count();
      badge.textContent = c;
      badge.style.display = c > 0 ? 'flex' : 'none';
    }
  }

  function getAll() {
    const favIds = get();
    return PRODUCTS.filter(p => favIds.includes(p.id));
  }

  function render(container) {
    const favProducts = getAll();

    if (favProducts.length === 0) {
      container.innerHTML = `
        <div class="text-center mt-6" style="padding:40px 20px;">
          <div style="font-size:48px;margin-bottom:16px;">💝</div>
          <div style="font-size:16px;color:var(--mi-gray-500);">还没有收藏任何平板</div>
          <div style="font-size:14px;color:var(--mi-gray-500);margin-top:8px;">
            在产品目录中点击 ❤️ 即可收藏
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="mb-4" style="font-size:14px;color:var(--mi-gray-500);">
        已收藏 ${favProducts.length} 款产品
      </div>
      <div class="products-grid">
        ${favProducts.map(p => Catalog.renderCard(p)).join('')}
      </div>
    `;
  }

  return { get, has, toggle, count, updateBadge, getAll, render };
})();
