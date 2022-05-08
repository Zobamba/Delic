export function getErrorMessage(error) {
  console.log(error);
  const message = error.errors[0];
  return {
    [message.path]: error.original.message,
  };
}
