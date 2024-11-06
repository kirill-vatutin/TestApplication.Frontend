export interface Item {
    id: string;
    name: string;
    description?: string;
    price: number;
    count: number;
    categoryName: string;
    createdTime: string;
    updatedTime?: string;
}

export interface CreateItemDto {
    name: string;
    description?: string;
    price: number;
    count: number;
    categoryId: string;
}

export interface UpdateItemDto {
    name?: string;
    description?: string;
    price?: number;
    count?: number;
}