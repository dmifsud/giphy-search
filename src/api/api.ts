export class Api {
    static async get<T>(url: string): Promise<T> {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                const errorData: T = await response.json();
                return Promise.reject(errorData);
                // throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const data: T = await response.json();

            // Return the validated data
            return data;

        } catch (error) {
            console.error('Failed to fetch data:', error);
            throw error;
        }
    }
}