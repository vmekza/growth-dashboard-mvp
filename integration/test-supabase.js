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

async function testConnection() {
  const { data, error } = await supabase
    .from("customers")
    .select("*");

  if (error) {
    console.error("Supabase error:", error);
    return;
  }

  console.log("Customers from Supabase:");
  console.log(data);
}

testConnection();
