require("dotenv").config();

const WebSocket = require("ws");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  {
    realtime: {
      transport: WebSocket
    }
  }
);

async function getDashboardMetrics() {

// number of customers

  const { count, error } = await supabase
    .from("customers")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.log("Could not count customers");
    return;
  }

  console.log("Total customers:", count);

// number of orders

const { count: orderCount, error: ordersError } = await supabase
  .from("orders")
  .select("*", { count: "exact", head: true });

if (ordersError) {
  console.log("Could not count orders");
  return;
}

console.log("Total orders:", orderCount);

// total revenue 

const { data: paidOrders, error: revenueError } = await supabase
  .from("orders")
  .select("total")
  .eq("status", "paid");

if (revenueError) {
  console.log("Could not calculate revenue");
  return;
}

let totalRevenue = 0;

for (const order of paidOrders) {
  totalRevenue = totalRevenue + Number(order.total);
}

console.log("Total revenue:", totalRevenue);

// average order value

const averageOrderValue = totalRevenue / paidOrders.length;

console.log("Average order value:", averageOrderValue.toFixed(2));

// total deals

const { count: dealCount, error: dealsError } = await supabase
  .from("deals")
  .select("*", { count: "exact", head: true });

if (dealsError) {
  console.log("Could not count deals");
  return;
}

console.log("Total CRM deals:", dealCount);

// total leads from cahtbot

const { count: chatbotLeadCount, error: chatbotError } = await supabase
  .from("chatbot_events")
  .select("*", { count: "exact", head: true })
  .eq("event", "lead_created");

if (chatbotError) {
  console.log("Could not count chatbot leads");
  return;
}

console.log("Chatbot leads:", chatbotLeadCount);

// won deals

const { data: wonDeals, error: wonDealsError } = await supabase
  .from("deals")
  .select("value")
  .eq("status", "won");

if (wonDealsError) {
  console.log("Could not calculate won deal value");
  return;
}

let wonDealValue = 0;

for (const deal of wonDeals) {
  wonDealValue = wonDealValue + Number(deal.value);
}

console.log("Won CRM deal value:", wonDealValue);

// open deals

const { data: openDeals, error: openDealsError } = await supabase
  .from("deals")
  .select("value")
  .eq("status", "open");

if (openDealsError) {
  console.log("Could not calculate open deal value");
  return;
}

let openDealValue = 0;

for (const deal of openDeals) {
  openDealValue = openDealValue + Number(deal.value);
}

console.log("Open CRM deal value:", openDealValue);

}

getDashboardMetrics();
