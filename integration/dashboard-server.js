require('dotenv').config();

const http = require('http');
const WebSocket = require('ws');
const { createClient } = require('@supabase/supabase-js');

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  {
    realtime: {
      transport: WebSocket,
    },
  },
);

// Create dashboard API server
const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'GET' && req.url === '/metrics') {
    try {
      // Count all customers
      const { count: customerCount, error: customersError } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true });

      if (customersError) {
        throw customersError;
      }

      // Count all orders
      const { count: orderCount, error: ordersError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      if (ordersError) {
        throw ordersError;
      }

      // Load paid orders to calculate revenue
      const { data: paidOrders, error: revenueError } = await supabase
        .from('orders')
        .select('total')
        .eq('status', 'paid');

      if (revenueError) {
        throw revenueError;
      }

      // Calculate total revenue
      let totalRevenue = 0;

      for (const order of paidOrders) {
        totalRevenue += Number(order.total);
      }

      // Calculate average order value
      const averageOrderValue =
        paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

      // Count all CRM deals
      const { count: dealCount, error: dealsError } = await supabase
        .from('deals')
        .select('*', { count: 'exact', head: true });

      if (dealsError) {
        throw dealsError;
      }

      // Count chatbot leads
      const { count: chatbotLeadCount, error: chatbotError } = await supabase
        .from('chatbot_events')
        .select('*', { count: 'exact', head: true })
        .eq('event', 'lead_created');

      if (chatbotError) {
        throw chatbotError;
      }

      // Load won CRM deals
      const { data: wonDeals, error: wonDealsError } = await supabase
        .from('deals')
        .select('value')
        .eq('status', 'won');

      if (wonDealsError) {
        throw wonDealsError;
      }

      // Calculate total value of won CRM deals
      let wonDealValue = 0;

      for (const deal of wonDeals) {
        wonDealValue += Number(deal.value);
      }

      // Load open CRM deals
      const { data: openDeals, error: openDealsError } = await supabase
        .from('deals')
        .select('value')
        .eq('status', 'open');

      if (openDealsError) {
        throw openDealsError;
      }

      // Calculate total value of open CRM deals
      let openDealValue = 0;

      for (const deal of openDeals) {
        openDealValue += Number(deal.value);
      }

      // Send all dashboard metrics as JSON
      res.end(
        JSON.stringify({
          totalCustomers: customerCount,
          totalOrders: orderCount,
          totalRevenue: totalRevenue,
          averageOrderValue: Number(averageOrderValue.toFixed(2)),
          totalCrmDeals: dealCount,
          chatbotLeads: chatbotLeadCount,
          wonCrmDealValue: wonDealValue,
          openCrmDealValue: openDealValue,
          generatedAt: new Date().toISOString(),
        }),
      );

      return;
    } catch (error) {
      console.error('Dashboard metrics error:', error);

      res.statusCode = 500;
      res.end(
        JSON.stringify({
          error: 'Could not load dashboard metrics',
        }),
      );

      return;
    }
  }

  // Return 404 for unknown routes
  res.statusCode = 404;
  res.end(
    JSON.stringify({
      error: 'Not found',
    }),
  );
});

// Start dashboard API
server.listen(3004, () => {
  console.log('Dashboard API running on http://localhost:3004');
});
