module.exports.paginate = (queryObject, paginateObject) => {
  if (queryObject.limit) {
    paginateObject.limit = parseInt(queryObject.limit);
    paginateObject.totalPage = Math.ceil(
      paginateObject.totalRow / paginateObject.limit
    );
  }
  if (
    queryObject.page &&
    queryObject.page >= 1 &&
    queryObject.page <= paginateObject.totalPage
  ) {
    paginateObject.page = parseInt(queryObject.page);
    paginateObject.skip = (paginateObject.page - 1) * paginateObject.limit;
  }
  return paginateObject;
};
