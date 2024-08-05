/**
 * Получает id файла и делает из него ссылку для сервера с файлами 
 */
export const useFile = (file_id: string): string => {
    const runtimeConfig = useRuntimeConfig();
    const url = new URL(file_id, runtimeConfig.public.filesApiURL);

    return url.toString();
}