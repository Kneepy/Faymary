/**
 * Получает id файла и делает из него ссылку для сервера с файлами 
 */
export const useFile = (file_id: string): string => {
    const appConfig = useAppConfig();

    return appConfig.filesApiURL + file_id;
}