export default (response, statusCode, object) => {
  response.status(statusCode).json({
    ...object
  });
};
