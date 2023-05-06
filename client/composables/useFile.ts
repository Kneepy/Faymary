export const useFile = (file_id: string): string => {
    return useRuntimeConfig().public.filesApiURL + file_id;
}