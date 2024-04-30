//Sort product
const sortProduct = document.querySelector("[sort]");
if (sortProduct) {
  const sortSelect = sortProduct.querySelector("[sort-select]");
  sortSelect.addEventListener("change", () => {
    const value = sortSelect.value;
    const [sortKey, sortValue] = value.split("-");
    const url = new URL(window.location.href);
    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortValue", sortValue);
    window.location.href = url;
  });
}
