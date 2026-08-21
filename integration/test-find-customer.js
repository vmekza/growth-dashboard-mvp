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

async function findCustomer() {
  const response = await fetch("http://localhost:3001/contacts");
  const contacts = await response.json();

  const email = contacts[0].email;

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    console.log("Customer not found");
    return;
  }

  console.log("Customer found in Supabase:");
  console.log(data);
}

findCustomer();
