const Category = require("../models/category.model");
module.exports.getCategory = async (parentId) => {
  const getAll=async(parentId)=>{
    const subCategories = await Category.find({
      parent_id: parentId,
      deleted: false,
      status: "active",
    });
    let allSub=[...subCategories];
    for(const sub of subCategories){
      const subSubCategories = await getAll(sub.id);
      allSub=allSub.concat(subSubCategories);
    }
    return allSub;
  }
  const result=await getAll(parentId);
  return result;
};
