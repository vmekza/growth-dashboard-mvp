async function loadMetrics() {
  const response = await fetch('http://localhost:3004/metrics');
  const metrics = await response.json();

  document.getElementById('total-customers').textContent =
    metrics.totalCustomers;

  document.getElementById('total-orders').textContent = metrics.totalOrders;

  document.getElementById('total-revenue').textContent =
    `€${metrics.totalRevenue}`;

  document.getElementById('average-order-value').textContent =
    `€${metrics.averageOrderValue}`;

  document.getElementById('total-crm-deals').textContent =
    metrics.totalCrmDeals;

  document.getElementById('chatbot-leads').textContent = metrics.chatbotLeads;

  document.getElementById('won-crm-deal-value').textContent =
    `€${metrics.wonCrmDealValue}`;

  document.getElementById('open-crm-deal-value').textContent =
    `€${metrics.openCrmDealValue}`;

  const refreshedTime = new Date(metrics.generatedAt);

  document.getElementById('last-refreshed').textContent =
    `Last refreshed ${refreshedTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
}

loadMetrics();

setInterval(loadMetrics, 30000);
