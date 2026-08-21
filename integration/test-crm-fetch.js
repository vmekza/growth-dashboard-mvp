async function getCRMData() {
  const contactsResponse = await fetch("http://localhost:3001/contacts");
  const contacts = await contactsResponse.json();

  const dealsResponse = await fetch("http://localhost:3001/deals");
  const deals = await dealsResponse.json();

  console.log("Contacts from fake CRM:");
  console.log(contacts);

  console.log("Deals from fake CRM:");
  console.log(deals);
}

getCRMData();
