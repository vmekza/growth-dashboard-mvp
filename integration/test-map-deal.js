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

async function mapDeal() {
  const contactsResponse = await fetch("http://localhost:3001/contacts");
  const contacts = await contactsResponse.json();

  const dealsResponse = await fetch("http://localhost:3001/deals");
  const deals = await dealsResponse.json();

  const deal = deals[0];

  const contact = contacts.find(
    contact => contact.id === deal.contact_id
  );

  const { data: customer, error } = await supabase
    .from("customers")
    .select("*")
    .eq("email", contact.email)
    .single();

  if (error) {
    console.log("Customer not found");
    return;
  }

  console.log("CRM deal:", deal.id);
  console.log("CRM contact:", contact.id);
  console.log("Email:", contact.email);
  console.log("Supabase customer id:", customer.id);
}

mapDeal();
