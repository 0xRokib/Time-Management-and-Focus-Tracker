import { getData, postData } from "@/lib/apiFunctions";
import { useMutation, useQuery } from "@tanstack/react-query";

// Custom hook for handling GET requests
export const useGetData = <T>(url: string) => {
  return useQuery<T>({
    queryKey: [url],
    queryFn: () => getData<T>(url),
    enabled: !!url,
  });
};

// Custom hook for handling POST requests
export const usePostData = <T, U>(url: string) => {
  return useMutation<U, Error, T>({
    mutationFn: (data: T) => postData<T, U>(url, data),
  });
};
