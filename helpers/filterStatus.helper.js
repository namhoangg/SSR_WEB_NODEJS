module.exports.filterStatus=(query,find)=>{
  let filterObject = [
    { name: "Tất cả", status: "", class: "active" },
    { name: "Hoạt động", status: "active", class: "" },
    { name: "Dừng hoạt động", status: "inactive", class: "" },
  ];
  const queryStatus =query.status;
  if (queryStatus && queryStatus == "active") {
    find.status = "active";
    filterObject[0].class = "";
    filterObject[1].class = "active";
    filterObject[2].class = "";
  }
  if (queryStatus && queryStatus == "inactive") {
    find.status = "inactive";
    filterObject[0].class = "";
    filterObject[1].class = "";
    filterObject[2].class = "active";
  }
  return filterObject;
}