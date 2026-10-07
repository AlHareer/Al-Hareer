import type { Order } from '@/app/account/page';

const esc = (v: unknown) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const inr = (n: number) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

function buildInvoiceHtml(order: Order, supportEmail?: string): string {
  const items = order.items ?? [];
  const itemsTotal = items.reduce((sum, it) => sum + (it.price ?? 0) * (it.qty ?? 1), 0);
  // Anything the order total carries beyond the items (shipping / COD fee) minus
  // discounts shows as one adjustment line, so the invoice always adds up.
  const adjustment = Math.round((order.total - itemsTotal) * 100) / 100;
  const a = order.shippingAddress;
  const addressLine = a ? [a.address, a.city, a.state].filter(Boolean).join(', ') + (a.pinCode ? ` - ${a.pinCode}` : '') : '';
  const paid = (order.paymentStatus || '').toLowerCase() === 'paid';

  const rows = items
    .map((it, i) => {
      const detail = [it.size && `Size ${it.size}`, it.color].filter(Boolean).join(' • ');
      return `<tr>
        <td>${i + 1}</td>
        <td><strong>${esc(it.name)}</strong>${detail ? `<div class="muted">${esc(detail)}</div>` : ''}</td>
        <td class="num">${it.qty ?? 1}</td>
        <td class="num">${inr(it.price ?? 0)}</td>
        <td class="num">${inr((it.price ?? 0) * (it.qty ?? 1))}</td>
      </tr>`;
    })
    .join('');

  return `<!doctype html><html><head><meta charset="utf-8"><title>Invoice ${esc(order.id)}</title>
<style>
  *{box-sizing:border-box} body{font-family:Arial,Helvetica,sans-serif;color:#00303A;margin:0;padding:32px;font-size:13px}
  .head{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #CFAC64;padding-bottom:16px}
  h1{margin:0;font-size:26px;letter-spacing:1px;color:#024F5F} .tag{margin:4px 0 0;color:#B08F4F;font-size:12px}
  .right{text-align:right} .right h2{margin:0;font-size:18px;letter-spacing:3px;text-transform:uppercase}
  .grid{display:flex;gap:32px;margin:20px 0} .grid>div{flex:1}
  .lbl{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#B08F4F;margin-bottom:6px}
  p{margin:2px 0} .muted{color:#4b6a72;font-size:11px;margin-top:2px}
  table{width:100%;border-collapse:collapse;margin-top:8px}
  th{background:#F6F1EC;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;padding:8px;border-bottom:1px solid #CFAC64}
  td{padding:10px 8px;border-bottom:1px solid #eee;vertical-align:top} .num{text-align:right;white-space:nowrap}
  th.num{text-align:right}
  .totals{margin-left:auto;width:260px;margin-top:14px}
  .totals div{display:flex;justify-content:space-between;padding:4px 0}
  .totals .grand{border-top:2px solid #CFAC64;margin-top:6px;padding-top:8px;font-size:16px;font-weight:700}
  .badge{display:inline-block;padding:2px 10px;border-radius:99px;font-size:11px;font-weight:700;background:#F6F1EC;border:1px solid #CFAC64}
  .foot{margin-top:36px;text-align:center;color:#4b6a72;font-size:11px;border-top:1px solid #eee;padding-top:12px}
  @media print{body{padding:0}}
</style></head><body>
  <div class="head">
    <div><h1>AL HAREER</h1><p class="tag">Arabian Fashion</p>${supportEmail ? `<p class="muted">${esc(supportEmail)}</p>` : ''}</div>
    <div class="right"><h2>Invoice</h2><p>Invoice for order <strong>${esc(order.id)}</strong></p><p class="muted">Date: ${esc(order.date)}</p></div>
  </div>
  <div class="grid">
    <div>
      <div class="lbl">Billed &amp; Shipped To</div>
      ${a?.fullName ? `<p><strong>${esc(a.fullName)}</strong></p>` : ''}
      ${addressLine ? `<p>${esc(addressLine)}</p>` : ''}
      ${a?.phone ? `<p>Phone: ${esc(a.phone)}</p>` : ''}
    </div>
    <div>
      <div class="lbl">Payment</div>
      <p>${esc(order.paymentMethod || 'Online Payment')}</p>
      <p>Status: <span class="badge">${paid ? 'PAID' : esc((order.paymentStatus || 'pending').toUpperCase())}</span></p>
      ${order.paymentId ? `<p class="muted">Payment ID: ${esc(order.paymentId)}</p>` : ''}
      <p class="muted">Order status: ${esc(order.status)}</p>
    </div>
  </div>
  <table>
    <thead><tr><th>#</th><th>Item</th><th class="num">Qty</th><th class="num">Price</th><th class="num">Amount</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="totals">
    <div><span>Items total</span><span>${inr(itemsTotal)}</span></div>
    ${adjustment !== 0 ? `<div><span>${adjustment > 0 ? 'Shipping / handling' : 'Discount'}</span><span>${adjustment > 0 ? '' : '-'}${inr(Math.abs(adjustment))}</span></div>` : ''}
    <div class="grand"><span>Total</span><span>${inr(order.total)}</span></div>
  </div>
  <div class="foot">Thank you for shopping with Al Hareer. This is a computer-generated invoice.</div>
</body></html>`;
}

// Prints the invoice straight from the current page: it is rendered in an
// off-screen A4-sized frame (a display:none or 0x0 frame prints blank in some
// browsers) and the browser's print dialog opens immediately. Choose
// "Save as PDF" there to download it.
export function printInvoice(order: Order, supportEmail?: string): void {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.cssText =
    'position:fixed;left:-10000px;top:0;width:794px;height:1123px;border:0;background:#fff';
  document.body.appendChild(iframe);

  const win = iframe.contentWindow;
  const doc = iframe.contentDocument;
  if (!win || !doc) {
    iframe.remove();
    return;
  }

  doc.open();
  doc.write(buildInvoiceHtml(order, supportEmail));
  doc.close();

  const previousTitle = document.title;
  const cleanup = () => {
    document.title = previousTitle;
    iframe.remove();
  };

  setTimeout(() => {
    // The page title is what Chrome suggests as the PDF file name.
    document.title = `Invoice-${order.id}`;
    win.addEventListener('afterprint', cleanup);
    win.focus();
    win.print();
    // afterprint isn't fired everywhere; make sure the frame never lingers.
    setTimeout(cleanup, 120_000);
  }, 300);
}
