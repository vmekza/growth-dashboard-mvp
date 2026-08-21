async function matchCustomer() {
  const crmResponse = await fetch("http://localhost:3001/contacts");
  const crmContacts = await crmResponse.json();

  const shopResponse = await fetch("http://localhost:3002/customers");
  const shopCustomers = await shopResponse.json();

  const crmCustomer = crmContacts[0];
  const shopCustomer = shopCustomers[0];

  if (crmCustomer.email === shopCustomer.email) {
    console.log("Same customer found:");
    console.log(crmCustomer.email);
  } else {
    console.log("Customers do not match");
  }
}

matchCustomer();
