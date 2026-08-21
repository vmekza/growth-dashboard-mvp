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

async function findDeal() {
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("crm_deal_id", "deal_001");

  if (error) {
    console.log("Error:", error);
    return;
  }

  console.log("Deal found in Supabase:");
  console.log(data);
}

findDeal();
