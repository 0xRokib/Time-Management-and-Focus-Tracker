import { deleteData, getData, postData, putData } from "@/lib/apiFunctions";
import { useMutation, useQuery } from "@tanstack/react-query";

// Custom hook for handling GET requests
export const useGetData = <T>(url: string) => {
  return useQuery<T>({
    queryKey: [url],
    queryFn: () => getData<T>(url),
  });
};

// Custom hook for handling POST requests
export const usePostData = <T, U>(url: string) => {
  return useMutation<U, Error, T>({
    mutationFn: (data: T) => postData<T, U>(url, data),
  });
};

// Custom hook for handling PUT requests
export const usePutData = <T, U>(url: string) => {
  return useMutation<U, Error, T>({
    mutationFn: (data: T) => putData<T, U>(url, data),
  });
};

// Custom hook for handling DELETE requests
export const useDeleteData = (url: string) => {
  return useMutation<void, Error>({
    mutationFn: () => deleteData(url),
  });
};
