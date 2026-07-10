/**
 * 规格对比模块
 */
const Compare = (() => {
  const MAX_COMPARE = 4;
  let selected = [];

  function toggle(productId) {
    const idx = selected.indexOf(productId);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      if (selected.length >= MAX_COMPARE) {
        alert(`最多同时对比 ${MAX_COMPARE} 款产品`);
        return;
      }
      selected.push(productId);
    }
    updateDrawer();
    renderCompareModal();
  }

  function remove(productId) {
    selected = selected.filter(id => id !== productId);
    updateDrawer();
    renderCompareModal();
  }

  function clear() {
    selected = [];
    updateDrawer();
    renderCompareModal();
  }

  function updateDrawer() {
    const drawer = document.getElementById('compare-drawer');
    const countEl = document.getElementById('compare-count');
    const chipsEl = document.getElementById('compare-chips');

    countEl.textContent = selected.length;

    if (selected.length > 0) {
      drawer.classList.add('show');
      chipsEl.innerHTML = selected.map(id => {
        const p = PRODUCTS.find(x => x.id === id);
        return `
          <div class="compare-chip">
            ${p.name}
            <span class="compare-chip-remove" onclick="Compare.remove('${id}')">✕</span>
          </div>
        `;
      }).join('');
    } else {
      drawer.classList.remove('show');
    }
  }

  function renderCompareModal() {
    if (selected.length < 2) return;

    const products = selected.map(id => PRODUCTS.find(p => p.id === id));
    const specs = [
      { label: '价格', key: 'price', format: v => `HK$${v.toLocaleString()}` },
      { label: '屏幕尺寸', key: 'sizeLabel' },
      { label: '刷新率', key: 'refreshRate', format: v => `${v}Hz` },
      { label: '面板', key: 'panel' },
      { label: '处理器', key: 'chip' },
      { label: '电池', key: 'battery', format: v => `${v}mAh` },
      { label: '充电', key: 'charging', format: v => `${v}W` },
      { label: '内存+存储', key: null, format: (_, p) => `${p.ram}GB + ${p.storage}GB` },
      { label: '扬声器', key: 'speakers', format: v => `${v}个` },
      { label: '手写笔', key: 'stylus', format: v => v ? '✅ 支持' : '❌ 不支持' },
      { label: '重量', key: 'weight', format: v => `${v}g` },
      { label: '评分', key: 'rating', format: v => `⭐ ${v}` }
    ];

    const headers = products.map(p => `<th style="min-width:180px;">${p.name}</th>`).join('');
    const rows = specs.map(spec => {
      const cells = products.map(p => {
        let val = spec.key ? p[spec.key] : spec.format(null, p);
        if (spec.format && spec.key) val = spec.format(val, p);
        // 找出最优值（仅数字比较）
        return `<td>${val}</td>`;
      }).join('');
      return `<tr><th>${spec.label}</th>${cells}</tr>`;
    }).join('');

    document.getElementById('compare-table-headers').innerHTML = `<th>规格</th>${headers}`;
    document.getElementById('compare-table-body').innerHTML = rows;
  }

  function openModal() {
    if (selected.length < 2) {
      alert('请至少选择 2 款产品进行对比');
      return;
    }
    renderCompareModal();
    document.getElementById('compare-modal').classList.add('show');
  }

  function closeModal() {
    document.getElementById('compare-modal').classList.remove('show');
  }

  return { toggle, remove, clear, openModal, closeModal, updateDrawer };
})();
