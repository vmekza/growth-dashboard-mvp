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

async function findOrder() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("shop_order_id", "order_001");

  if (error) {
    console.log("Error:", error);
    return;
  }

  console.log("Order found in Supabase:");
  console.log(data);
}

findOrder();
