async function loadMetrics() {
  const response = await fetch(
    'https://growth-dashboard-api-h4il.onrender.com/metrics',
  );
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

const createOrderButton = document.getElementById('create-order-button');
const demoMessage = document.getElementById('demo-message');

createOrderButton.addEventListener('click', async () => {
  createOrderButton.disabled = true;
  createOrderButton.textContent = 'Creating...';
  demoMessage.textContent = '';

  try {
    const response = await fetch(
      'https://growth-dashboard-api-h4il.onrender.com/demo/order',
      {
        method: 'POST',
      },
    );

    if (!response.ok) {
      throw new Error('Could not create demo order');
    }

    const result = await response.json();

    demoMessage.textContent = `New €${result.order.total} order created for ${result.customer}`;

    await loadMetrics();
  } catch (error) {
    console.error('Demo action error:', error);
    demoMessage.textContent = 'Could not create demo order.';
  } finally {
    createOrderButton.disabled = false;
    createOrderButton.textContent = 'Create Demo Order';
  }
});

const createDealButton = document.getElementById('create-deal-button');
const createLeadButton = document.getElementById('create-lead-button');

createDealButton.addEventListener('click', async () => {
  createDealButton.disabled = true;
  createDealButton.textContent = 'Creating...';

  try {
    const response = await fetch(
      'https://growth-dashboard-api-h4il.onrender.com/demo/deal',
      { method: 'POST' },
    );

    if (!response.ok) throw new Error();

    demoMessage.textContent = 'New €250 CRM deal created';
    await loadMetrics();
  } catch {
    demoMessage.textContent = 'Could not create CRM deal.';
  } finally {
    createDealButton.disabled = false;
    createDealButton.textContent = 'Create CRM Deal';
  }
});

createLeadButton.addEventListener('click', async () => {
  createLeadButton.disabled = true;
  createLeadButton.textContent = 'Sending...';

  try {
    const response = await fetch(
      'https://growth-dashboard-api-h4il.onrender.com/demo/lead',
      { method: 'POST' },
    );

    if (!response.ok) throw new Error();

    demoMessage.textContent = 'New chatbot lead created';
    await loadMetrics();
  } catch {
    demoMessage.textContent = 'Could not create chatbot lead.';
  } finally {
    createLeadButton.disabled = false;
    createLeadButton.textContent = 'Send Chatbot Lead';
  }
});
