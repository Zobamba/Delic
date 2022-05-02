export function getErrorMessage(error) {
  const message = error.errors[0];
  return {
    [message.path]: error.original.message,
  };
}
