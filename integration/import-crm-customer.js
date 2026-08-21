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

async function importCustomers() {
  const response = await fetch("http://localhost:3001/contacts");
  const contacts = await response.json();

  for (const contact of contacts) {
    const email = contact.email.trim().toLowerCase();

    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (existingCustomer) {
      console.log("Customer already exists:", existingCustomer.name);
      continue;
    }

    const { data: newCustomer, error } = await supabase
      .from("customers")
      .insert({
        name: contact.name,
        email: email
      })
      .select()
      .single();

    if (error) {
      console.log("Insert error:", error);
      continue;
    }

    console.log("Customer created automatically:");
    console.log(newCustomer);
  }
}

importCustomers();
