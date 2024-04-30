// Filer products by status
const filterProductsButton = document.querySelectorAll("[button-status]");
if (filterProductsButton.length > 0) {
  let url = new URL(window.location.href);
  filterProductsButton.forEach((button) => {
    button.addEventListener("click", (e) => {
      const status = button.getAttribute("button-status");
      status
        ? url.searchParams.set("status", status)
        : url.searchParams.delete("status");
      window.location.href = url.href;
    });
  });
}
// End filer products by status

// Form search
const formSearch = document.querySelector("#searchForm");
if (formSearch) {
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = formSearch.querySelector("input").value;
    const url = new URL(window.location.href);
    keyword
      ? url.searchParams.set("keyword", keyword)
      : url.searchParams.delete("keyword");
    window.location.href = url.href;
  });
}
// End form search

//Clear search
const clearSearch = document.querySelector("[clear-search]");
if (clearSearch) {
  clearSearch.addEventListener("click", () => {
    const url = new URL(window.location.href);
    // Clear all after "?"
    const baseUrl = url.origin + url.pathname;
    window.location.href = baseUrl;
  });
}

// Pagination
const tableLengthSelect = document.querySelector("#table-length-select");
if (tableLengthSelect) {
  tableLengthSelect.addEventListener("change", () => {
    let url = new URL(window.location.href);
    url.searchParams.set("limit", tableLengthSelect.value);
    window.location.href = url.href;
  });
}
const buttonPrev = document.querySelector("#table-pagination-prev");
if (buttonPrev) {
  buttonPrev.addEventListener("click", () => {
    let url = new URL(window.location.href);
    const page = parseInt(buttonPrev.getAttribute("data-page"));
    if (page == 1) {
      return;
    }
    url.searchParams.set("page", page - 1);
    window.location.href = url.href;
  });
}
const buttonNext = document.querySelector("#table-pagination-next");
if (buttonNext) {
  buttonNext.addEventListener("click", () => {
    let url = new URL(window.location.href);
    const page = parseInt(buttonNext.getAttribute("data-page"));
    const totalPage = parseInt(buttonNext.getAttribute("data-total-page"));
    if (page == totalPage) {
      return;
    }
    url.searchParams.set("page", page + 1);
    window.location.href = url.href;
  });
}
const pagePagination = document.querySelector(".page-pagination");
if (pagePagination) {
  pagePagination.addEventListener("change", () => {
    let url = new URL(window.location.href);
    url.searchParams.set("page", pagePagination.value);
    window.location.href = url.href;
  });
}

//Close alert
const alert = document.querySelector("[alert]");
if (alert) {
  const time = alert.getAttribute("data-time");
  setTimeout(() => {
    alert.style.display = "none";
  }, time);
}

//Preview thumbnail
const uploadImageInput = document.querySelector("[upload-image-input]");
if (uploadImageInput) {
  uploadImageInput.addEventListener("change", () => {
    const uploadImagePreview = document.querySelector("[upload-image-preview]");
    if (uploadImagePreview) {
      uploadImagePreview.src = URL.createObjectURL(uploadImageInput.files[0]);
      uploadImagePreview.alt = uploadImageInput.files[0].name;
      uploadImagePreview.style.display = "block";
    }
  }); //Upload image
}

// Change status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");
  buttonChangeStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const currentStatus = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");
      let newStatus = currentStatus === "active" ? "inactive" : "active";
      const action = path + `/${newStatus}/${id}?_method=PATCH`;
      formChangeStatus.setAttribute("action", action);
      formChangeStatus.submit();
    });
  });
}

//Change status multi
const checkBoxMulti = document.querySelector("[check-box-multi]");
if (checkBoxMulti) {
  const checkAll = checkBoxMulti.querySelector("input[name='check-all']");
  const checkBox = checkBoxMulti.querySelectorAll("input[name='id']");
  checkAll.addEventListener("click", () => {
    if (checkAll && checkAll.checked) {
      checkBox.forEach((checkbox) => {
        checkbox.checked = true;
      });
    } else {
      checkBox.forEach((checkbox) => {
        checkbox.checked = false;
      });
    }
  });
  checkBox.forEach((checkbox) => {
    checkbox.addEventListener("click", () => {
      const checkedCount = document.querySelectorAll(
        "input[name='id']:checked"
      ).length;
      if (checkedCount == checkBox.length) {
        checkAll.checked = true;
      } else {
        checkAll.checked = false;
      }
    });
  });
}
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = formChangeMulti.querySelector("input[name='ids']");
    const ids = document.querySelectorAll("input[name='id']:checked");
    const type = formChangeMulti.querySelector("select").value;
    if (ids.length <= 0) {
      alert("Please select at least one product");
      return;
    }
    if (!type) {
      alert("Please select an action");
      return;
    }
    idsValue = "";
    ids.forEach((id) => {
      idsValue += id.value;
      if (type == "change-position") {
        const inputPosition = id
          .closest("tr")
          .querySelector("input[name='position']");
        idsValue += "-" + inputPosition.value;
      }
      idsValue += ",";
    });
    idsValue = idsValue.slice(0, -1);
    if (type == "delete") {
      const confirmDelete = confirm("Bạn có chắc muốn xóa?");
      if (!confirmDelete) {
        return;
      }
    }
    input.value = idsValue;
    formChangeMulti.submit();
  });
}
// Delete 
const buttonDelete = document.querySelectorAll("[button-delete]");
if (buttonDelete.length > 0) {
  const formDelete = document.querySelector("#form-delete");
  const path = formDelete.getAttribute("data-path");
  buttonDelete.forEach((button) => {
    button.addEventListener("click", () => {
      const confirmDelete = confirm("Bạn có chắc muốn xóa?");
      if (!confirmDelete) {
        return;
      }
      const id = button.getAttribute("data-id");
      const action = path + `/${id}?_method=DELETE`;
      formDelete.setAttribute("action", action);
      formDelete.submit();
    });
  });
}
