async function getShopData() {
  const customersResponse = await fetch("http://localhost:3002/customers");
  const customers = await customersResponse.json();

  const ordersResponse = await fetch("http://localhost:3002/orders");
  const orders = await ordersResponse.json();

  console.log("Customers from fake shop:");
  console.log(customers);

  console.log("Orders from fake shop:");
  console.log(orders);
}

getShopData();
