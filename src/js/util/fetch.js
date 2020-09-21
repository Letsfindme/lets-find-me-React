export const apiFetch = async (url, options) => {
  let res = null;
  let error = null;
  let status = null;
  let isLoading = true;
  isLoading = true;
  try {
    const response = await fetch(url, options);
    const json = await response.json();
    res = json;
    status = response.status;
    isLoading = false;
  } catch (error) {
    error = error;
  }
  return { res, error, isLoading, status };
};
