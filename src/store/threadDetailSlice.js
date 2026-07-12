import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchThreadDetail = createAsyncThunk(
  'threadDetail/fetch',
  async (threadId) => {
    const { detailThread } = await api.getThreadDetail(threadId);
    return detailThread;
  },
);

export const createComment = createAsyncThunk(
  'threadDetail/createComment',
  async ({ threadId, content }) => {
    const { comment } = await api.createComment(threadId, content);
    return comment;
  },
);

export const voteComment = createAsyncThunk(
  'threadDetail/voteComment',
  async ({
    threadId, commentId, voteType,
  }) => {
    if (voteType === 'up') await api.upVoteComment(threadId, commentId);
    else if (voteType === 'down') await api.downVoteComment(threadId, commentId);
    else await api.neutralVoteComment(threadId, commentId);
  },
);

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState: { thread: null, loading: false, error: null },
  reducers: {
    optimisticVoteDetail(state, action) {
      const { threadId, voteType, userId } = action.payload;
      if (!state.thread || state.thread.id !== threadId) return;
      state.thread.upVotesBy = state.thread.upVotesBy.filter((id) => id !== userId);
      state.thread.downVotesBy = state.thread.downVotesBy.filter((id) => id !== userId);
      if (voteType === 'up') state.thread.upVotesBy.push(userId);
      else if (voteType === 'down') state.thread.downVotesBy.push(userId);
    },
    optimisticVoteComment(state, action) {
      const { commentId, voteType, userId } = action.payload;
      if (!state.thread) return;
      const comment = state.thread.comments.find((c) => c.id === commentId);
      if (!comment) return;
      comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
      comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
      if (voteType === 'up') comment.upVotesBy.push(userId);
      else if (voteType === 'down') comment.downVotesBy.push(userId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreadDetail.pending, (state) => {
        state.loading = true;
        state.thread = null;
        state.error = null;
      })
      .addCase(fetchThreadDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.thread = action.payload;
      })
      .addCase(fetchThreadDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        if (state.thread) state.thread.comments.push(action.payload);
      });
  },
});

export const { optimisticVoteDetail, optimisticVoteComment } = threadDetailSlice.actions;
export default threadDetailSlice.reducer;
