import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Item, CreateItemDto, UpdateItemDto } from '../../interfaces/item.interface';
import { apiService } from '../../services/api.service';

interface ItemsState {
  items: Item[];
  loading: boolean;
  error: string | null;
}

const initialState: ItemsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async (_, { rejectWithValue }) => {
    try {
      return await apiService.getItems();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createItem = createAsyncThunk(
    'items/createItem',
    async (item: CreateItemDto, { rejectWithValue }) => {
        try {
            const id = await apiService.createItem(item);
            const newItem: Item = {
                id,
                name: item.name,
                description: item.description,
                price: item.price,
                count: item.count,
                categoryName: '',
                createdTime: new Date().toISOString(),
            };
            return newItem;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const updateItem = createAsyncThunk(
  'items/updateItem',
  async ({ id, data }: { id: string; data: UpdateItemDto }, { rejectWithValue }) => {
    try {
      await apiService.updateItem(id, data);
      return { id, ...data };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteItem = createAsyncThunk(
  'items/deleteItem',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/Items/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete item');
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action: PayloadAction<Item[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createItem.fulfilled, (state, action: PayloadAction<Item>) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = itemsSlice.actions;
export default itemsSlice.reducer; 