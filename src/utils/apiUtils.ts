export const getErrorMessage = (error: unknown): string => {
    return error && typeof error === 'object' && 'response' in error &&
        (error as any).response && typeof (error as any).response === 'object' && 'data' in (error as any).response &&
        (error as any).response.data && typeof (error as any).response.data === 'object' && 'error' in (error as any).response.data
        ? ((error as any).response.data as { error: string }).error
        : "An error occurred. Please try again later.";
};
