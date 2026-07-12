import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchThreads = createAsyncThunk('threads/fetchAll', async () => {
  const { threads } = await api.getThreads();
  const { users } = await api.getUsers();
  return { threads, users };
});

export const createThread = createAsyncThunk(
  'threads/create',
  async ({ title, body, category }) => {
    const { thread } = await api.createThread(title, body, category);
    return thread;
  },
);

export const voteThread = createAsyncThunk(
  'threads/vote',
  async ({ threadId, voteType }) => {
    if (voteType === 'up') await api.upVoteThread(threadId);
    else if (voteType === 'down') await api.downVoteThread(threadId);
    else await api.neutralVoteThread(threadId);
  },
);

const threadsSlice = createSlice({
  name: 'threads',
  initialState: {
    items: [], users: [], loading: false, error: null, categoryFilter: '',
  },
  reducers: {
    setCategoryFilter(state, action) {
      state.categoryFilter = action.payload;
    },
    optimisticVoteThread(state, action) {
      const { threadId, voteType, userId } = action.payload;
      const thread = state.items.find((t) => t.id === threadId);
      if (!thread) return;
      thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
      thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);
      if (voteType === 'up') thread.upVotesBy.push(userId);
      else if (voteType === 'down') thread.downVotesBy.push(userId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.threads;
        state.users = action.payload.users;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createThread.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  },
});

export const { setCategoryFilter, optimisticVoteThread } = threadsSlice.actions;
export default threadsSlice.reducer;
