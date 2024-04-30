const buttonDeleteAccount = document.querySelectorAll("[button-delete-role]");
if (buttonDeleteAccount) {
  buttonDeleteAccount.forEach((button) => {
    button.addEventListener("click", (e) => {
      isConfirm = confirm("Bạn có chắc chắn muốn xóa không?");
      if (isConfirm) {
        const formDelete = document.querySelector("#form-delete");
        if (formDelete) {
          const id = button.getAttribute("data-id");
          const action =
            formDelete.getAttribute("data-path") + `/${id}?_method=DELETE`;
          formDelete.setAttribute("action", action);
          formDelete.submit();
        }
      }
    });
  });
}
