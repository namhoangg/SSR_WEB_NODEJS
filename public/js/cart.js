//update quantity
const inputQuantity = document.querySelectorAll("input[name='quantity']");
if (inputQuantity) {
  inputQuantity.forEach((item) => {
    item.addEventListener("change", async (e) => {
      const id = item.getAttribute("item-id");
      const quantity = item.value;
      if (quantity < 1) {
        quantity = 1;
      }
      window.location.href = `/cart/update/${id}/${quantity}`;
    });
  });
}
//end update
