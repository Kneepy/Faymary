/**
 * Получает id файла и делает из него ссылку для сервера с файлами 
 */
export const useFile = (file_id: string): string => {
    const runtimeConfig = useRuntimeConfig();

    return runtimeConfig.public.filesApiURL + file_id;
}