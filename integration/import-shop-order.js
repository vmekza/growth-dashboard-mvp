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

async function importOrders() {
  const customersResponse = await fetch("http://localhost:3002/customers");
  const customers = await customersResponse.json();

  const ordersResponse = await fetch("http://localhost:3002/orders");
  const orders = await ordersResponse.json();

  for (const order of orders) {
    const shopCustomer = customers.find(
      customer => customer.id === order.customer_id
    );

    const email = shopCustomer.email.trim().toLowerCase();

    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("id")
      .eq("email", email)
      .single();

    if (customerError) {
      console.log("Customer not found for order:", order.id);
      continue;
    }

    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id")
      .eq("shop_order_id", order.id)
      .maybeSingle();

    if (existingOrder) {
      console.log("Order already exists:", order.id);
      continue;
    }

    const { data: insertedOrder, error: insertError } = await supabase
      .from("orders")
      .insert({
        shop_order_id: order.id,
        customer_id: customer.id,
        total: order.total,
        status: order.status
      })
      .select()
      .single();

    if (insertError) {
      console.log("Insert error:", insertError);
      continue;
    }

    console.log("Order inserted automatically:");
    console.log(insertedOrder);
  }
}

importOrders();
