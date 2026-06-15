const fs = require('fs');
const path = require('path');

function generateInvoice(order) {
  const invoicesDir = path.join(__dirname, '..', 'invoices');
  if (!fs.existsSync(invoicesDir)) fs.mkdirSync(invoicesDir, { recursive: true });

  const fileName = `invoice-${order._id || Date.now()}.json`;
  const filePath = path.join(invoicesDir, fileName);
  const invoiceData = {
    id: order._id || null,
    date: new Date().toISOString(),
    user: order.user || null,
    items: order.items || [],
    total: order.totalPrice || 0
  };

  fs.writeFileSync(filePath, JSON.stringify(invoiceData, null, 2));
  return filePath;
}

module.exports = { generateInvoice };
