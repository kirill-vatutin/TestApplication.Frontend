
class ApiService {
    private baseUrl = '';

    async getItems() {
        const response = await fetch(`${this.baseUrl}/api/Items`);
        if (!response.ok) throw new Error('Failed to get items');
        return response.json();
    }

    async createItem(data:unknown) {
        const response = await fetch(`${this.baseUrl}/api/Items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create item');
        return response.json();
    }

    async updateItem(id: string, data:unknown) {
        const response = await fetch(`${this.baseUrl}/api/Items/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update item');
        return response.json();
    }

    async deleteItem(id: string) {
        const response = await fetch(`${this.baseUrl}/api/Items/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete item');
    }
}

export const apiService = new ApiService(); 