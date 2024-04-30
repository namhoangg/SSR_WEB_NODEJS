const createTree = (records, parentId = "") => {
  let tree = [];
  for (const record of records) {
    if (record.parent_id == parentId) {
      let children = createTree(records.slice(1), record.id);
      if (children.length > 0) {
        record.children = children;
      }
      tree.push(record);
    }
  }
  return tree;
};
module.exports.create = (records) => {
  return createTree(records);
};
