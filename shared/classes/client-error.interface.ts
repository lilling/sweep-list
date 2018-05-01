export interface IClientError {
    /**
     * Epic correct path.
     */
    actionType: string;
    /**
     * Original error
     */
    error: Error;
    /**
     * Optional more data
     */
    body?: any;
    /**
     * Is critical - system wide errors such as connection issues
     */
    isCritical?: boolean;
}
