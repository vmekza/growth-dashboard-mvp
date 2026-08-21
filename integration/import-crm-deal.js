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

async function importDeals() {
  const contactsResponse = await fetch("http://localhost:3001/contacts");
  const contacts = await contactsResponse.json();

  const dealsResponse = await fetch("http://localhost:3001/deals");
  const deals = await dealsResponse.json();

  for (const deal of deals) {
    const contact = contacts.find(
      contact => contact.id === deal.contact_id
    );

    const email = contact.email.trim().toLowerCase();

    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("id")
      .eq("email", email)
      .single();

    if (customerError) {
      console.log("Customer not found for deal:", deal.id);
      continue;
    }

    const { data: existingDeal } = await supabase
      .from("deals")
      .select("id")
      .eq("crm_deal_id", deal.id)
      .maybeSingle();

    if (existingDeal) {
      console.log("Deal already exists:", deal.id);
      continue;
    }

    const { data: insertedDeal, error: insertError } = await supabase
      .from("deals")
      .insert({
        crm_deal_id: deal.id,
        customer_id: customer.id,
        value: deal.value,
        status: deal.status
      })
      .select()
      .single();

    if (insertError) {
      console.log("Insert error:", insertError);
      continue;
    }

    console.log("Deal inserted automatically:");
    console.log(insertedDeal);
  }
}

importDeals();
