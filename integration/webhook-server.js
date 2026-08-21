require("dotenv").config();

const http = require("http");
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

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/chatbot-webhook") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", async () => {
      const chatbotEvent = JSON.parse(body);

      const email = chatbotEvent.email.trim().toLowerCase();

      // search customer in customer by email
      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .select("id")
        .eq("email", email)
        .single();

      if (customerError) {
        console.log("Customer not found");

        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Customer not found" }));
        return;
      }

	//check if data already existed in db
	const { data: existingEvent } = await supabase
  	.from("chatbot_events")
  	.select("id")
  	.eq("conversation_id", chatbotEvent.conversation_id)
  	.maybeSingle();

	if (existingEvent) {
  	console.log("Chatbot event already exists:", chatbotEvent.conversation_id);

  	res.setHeader("Content-Type", "application/json");
  	res.end(JSON.stringify({ received: true, duplicate: true }));
  	return;
	}
 
      // record from  chatbot in Supabase
      const { data: insertedEvent, error: insertError } = await supabase
        .from("chatbot_events")
        .insert({
          conversation_id: chatbotEvent.conversation_id,
          customer_id: customer.id,
          event: chatbotEvent.event
        })
        .select()
        .single();

      if (insertError) {
        console.log("Insert error:", insertError);

        res.statusCode = 500;
        res.end(JSON.stringify({ error: "Insert failed" }));
        return;
      }

      console.log("Chatbot event inserted automatically:");
      console.log(insertedEvent);

      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ received: true }));
    });

    return;
  }

  res.statusCode = 404;
  res.end("Not found");
});

server.listen(3003, () => {
  console.log("Webhook receiver running on http://localhost:3003");
});
