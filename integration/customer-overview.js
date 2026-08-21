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

async function showCustomerOverview() {
  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .select("*")
    .eq("email", "anna@example.com")
    .single();

  if (customerError) {
    console.log("Customer not found");
    return;
  }

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_id", customer.id);

  if (ordersError) {
    console.log("Could not load orders");
    return;   
  }

const { data: deals, error: dealsError } = await supabase
  .from("deals")
  .select("*")
  .eq("customer_id", customer.id);
  
if (dealsError) {
  console.log("Could not load deals");
  return;
}

const { data: chatbotEvents, error: chatbotEventsError } = await supabase
  .from("chatbot_events")
  .select("*")
  .eq("customer_id", customer.id);

if (chatbotEventsError) {
  console.log("Could not load chatbot events");
  return;
}

  console.log("Customer:");
  console.log(customer);

  console.log("Orders:");
  console.log(orders);

console.log("Deals:");
console.log(deals);

console.log("Chatbot events:");
console.log(chatbotEvents);

// total cost of orders

let totalSpent = 0;

for (const order of orders) {
  totalSpent = totalSpent + Number(order.total);
}

console.log("Total spent:", totalSpent);

const orderCount = orders.length;

console.log("Order count:", orderCount);

// average cost of orders

const averageOrderValue = totalSpent / orderCount;

console.log("Average order value:", averageOrderValue);

//total value of CRM-deals

let totalDealValue = 0;

for (const deal of deals) {
  totalDealValue = totalDealValue + Number(deal.value);
}

console.log("Total CRM deal value:", totalDealValue);

// total number of chatbot events

const chatbotEventCount = chatbotEvents.length;

console.log("Chatbot event count:", chatbotEventCount);

}

showCustomerOverview();
