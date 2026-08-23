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

// Load metrics when the page opens
loadMetrics();

// Refresh metrics every 30 seconds
setInterval(loadMetrics, 30000);

// Demo controls
const createOrderButton = document.getElementById('create-order-button');
const createDealButton = document.getElementById('create-deal-button');
const createLeadButton = document.getElementById('create-lead-button');

const orderMessage = document.getElementById('order-message');
const dealMessage = document.getElementById('deal-message');
const leadMessage = document.getElementById('lead-message');

// Create demo e-commerce order
createOrderButton.addEventListener('click', async () => {
  createOrderButton.disabled = true;
  createOrderButton.textContent = 'Creating...';
  orderMessage.textContent = '';

  const oldOrders = document.getElementById('total-orders').textContent;
  const oldRevenue = document.getElementById('total-revenue').textContent;

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

    await loadMetrics();

    const newOrders = document.getElementById('total-orders').textContent;
    const newRevenue = document.getElementById('total-revenue').textContent;

    orderMessage.textContent = `✓ Order created — Orders ${oldOrders} → ${newOrders} · Revenue ${oldRevenue} → ${newRevenue}`;
  } catch (error) {
    console.error('Demo order error:', error);
    orderMessage.textContent = 'Could not create demo order.';
  } finally {
    createOrderButton.disabled = false;
    createOrderButton.textContent = 'Create Demo Order';
  }
});

// Create demo CRM deal
createDealButton.addEventListener('click', async () => {
  createDealButton.disabled = true;
  createDealButton.textContent = 'Creating...';
  dealMessage.textContent = '';

  const oldDeals = document.getElementById('total-crm-deals').textContent;

  const oldOpenValue = document.getElementById(
    'open-crm-deal-value',
  ).textContent;

  try {
    const response = await fetch(
      'https://growth-dashboard-api-h4il.onrender.com/demo/deal',
      {
        method: 'POST',
      },
    );

    if (!response.ok) {
      throw new Error('Could not create demo deal');
    }

    await loadMetrics();

    const newDeals = document.getElementById('total-crm-deals').textContent;

    const newOpenValue = document.getElementById(
      'open-crm-deal-value',
    ).textContent;

    dealMessage.textContent = `✓ CRM deal created — Deals ${oldDeals} → ${newDeals} · Open value ${oldOpenValue} → ${newOpenValue}`;
  } catch (error) {
    console.error('Demo deal error:', error);
    dealMessage.textContent = 'Could not create CRM deal.';
  } finally {
    createDealButton.disabled = false;
    createDealButton.textContent = 'Create CRM Deal';
  }
});

// Create demo chatbot lead
createLeadButton.addEventListener('click', async () => {
  createLeadButton.disabled = true;
  createLeadButton.textContent = 'Sending...';
  leadMessage.textContent = '';

  const oldLeads = document.getElementById('chatbot-leads').textContent;

  try {
    const response = await fetch(
      'https://growth-dashboard-api-h4il.onrender.com/demo/lead',
      {
        method: 'POST',
      },
    );

    if (!response.ok) {
      throw new Error('Could not create chatbot lead');
    }

    await loadMetrics();

    const newLeads = document.getElementById('chatbot-leads').textContent;

    leadMessage.textContent = `✓ Chatbot lead created — Leads ${oldLeads} → ${newLeads}`;
  } catch (error) {
    console.error('Demo lead error:', error);
    leadMessage.textContent = 'Could not create chatbot lead.';
  } finally {
    createLeadButton.disabled = false;
    createLeadButton.textContent = 'Send Chatbot Lead';
  }
});
