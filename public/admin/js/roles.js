//Permissions handle
const tablePermissions = document.querySelector("[table-permissions]");
if (tablePermissions) {
  const buttonSubmit = document.querySelector("[button-submit]");
  if (buttonSubmit) {
    buttonSubmit.addEventListener("click", async (e) => {
      let permissions = [];
      const rows = tablePermissions.querySelectorAll("[data-name]");
      rows.forEach((row) => {
        const name = row.getAttribute("data-name");
        const inputs = row.querySelectorAll("input");
        if (name == "id") {
          inputs.forEach((input) => {
            const id = input.value;
            permissions.push({
              id: id,
              permissions: [],
            });
          });
        } else {
          inputs.forEach((input, index) => {
            const checked = input.checked;
            if (checked) {
              permissions[index].permissions.push(name);
            }
          });
        }
      });
      if (permissions.length > 0) {
        const formChangePermissions = document.querySelector(
          "#form-change-permissions"
        );
        if (formChangePermissions) {
          const inputPermissions = formChangePermissions.querySelector(
            "input[name='permissions']"
          );
          inputPermissions.value = JSON.stringify(permissions);
          formChangePermissions.submit();
        }
      }
    });
  }
}
