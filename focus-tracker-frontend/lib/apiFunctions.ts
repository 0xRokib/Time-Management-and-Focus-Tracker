import apiClient from "./apiClient";

// GET request
export const getData = async <T>(url: string): Promise<T> => {
  const response = await apiClient.get(url);
  return response.data;
};

// POST request
export const postData = async <T, U>(url: string, data: T): Promise<U> => {
  const response = await apiClient.post(url, data);
  return response.data;
};

// PUT request
export const putData = async <T, U>(url: string, data: T): Promise<U> => {
  const response = await apiClient.put(url, data);
  return response.data;
};

// DELETE request
export const deleteData = async (url: string): Promise<void> => {
  await apiClient.delete(url);
};
