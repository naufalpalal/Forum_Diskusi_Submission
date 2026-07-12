/**
 * Unit tests for threadDetailSlice reducer
 *
 * Skenario:
 * - optimisticVoteDetail upvote: menambahkan userId ke upVotesBy thread
 * - optimisticVoteDetail downvote: memindahkan userId dari upVotesBy ke downVotesBy thread
 * - optimisticVoteDetail neutral: menghapus userId dari kedua array vote thread
 * - optimisticVoteComment upvote: menambahkan userId ke upVotesBy komentar
 * - optimisticVoteComment neutral: menghapus userId dari upVotesBy komentar
 * - fetchThreadDetail.pending: mengatur loading true dan thread null
 * - fetchThreadDetail.fulfilled: mengisi thread dan loading false
 * - createComment.fulfilled: menambahkan komentar baru ke thread.comments
 */

import { describe, it, expect } from 'vitest';
import threadDetailReducer, {
  optimisticVoteDetail,
  optimisticVoteComment,
  fetchThreadDetail, createComment,
} from '../store/threadDetailSlice';

const mockComment = {
  id: 'comment-1',
  content: 'Test comment',
  upVotesBy: [],
  downVotesBy: [],
  createdAt: new Date().toISOString(),
  owner: { id: 'user-1', name: 'Alice', avatar: '' },
};

const mockThread = {
  id: 'thread-1',
  title: 'Test',
  body: 'Body',
  upVotesBy: ['user-2'],
  downVotesBy: [],
  comments: [mockComment],
};

const initialState = { thread: null, loading: false, error: null };

describe('threadDetailSlice reducer', () => {
  it('optimisticVoteDetail upvote: harus menambahkan userId ke upVotesBy thread', () => {
    const prevState = { ...initialState, thread: { ...mockThread } };
    const state = threadDetailReducer(
      prevState,
      optimisticVoteDetail({ threadId: 'thread-1', voteType: 'up', userId: 'user-1' }),
    );
    expect(state.thread.upVotesBy).toContain('user-1');
    expect(state.thread.downVotesBy).not.toContain('user-1');
  });

  it('optimisticVoteDetail downvote: harus memindahkan userId ke downVotesBy', () => {
    const prevState = {
      ...initialState,
      thread: { ...mockThread, upVotesBy: ['user-1'], downVotesBy: [] },
    };
    const state = threadDetailReducer(
      prevState,
      optimisticVoteDetail({ threadId: 'thread-1', voteType: 'down', userId: 'user-1' }),
    );
    expect(state.thread.downVotesBy).toContain('user-1');
    expect(state.thread.upVotesBy).not.toContain('user-1');
  });

  it('optimisticVoteDetail neutral: harus menghapus userId dari semua vote thread', () => {
    const prevState = {
      ...initialState,
      thread: { ...mockThread, upVotesBy: ['user-1'], downVotesBy: [] },
    };
    const state = threadDetailReducer(
      prevState,
      optimisticVoteDetail({ threadId: 'thread-1', voteType: 'neutral', userId: 'user-1' }),
    );
    expect(state.thread.upVotesBy).not.toContain('user-1');
    expect(state.thread.downVotesBy).not.toContain('user-1');
  });

  it('optimisticVoteComment upvote: harus menambahkan userId ke upVotesBy komentar', () => {
    const prevState = {
      ...initialState,
      thread: { ...mockThread, comments: [{ ...mockComment }] },
    };
    const state = threadDetailReducer(
      prevState,
      optimisticVoteComment({ commentId: 'comment-1', voteType: 'up', userId: 'user-1' }),
    );
    expect(state.thread.comments[0].upVotesBy).toContain('user-1');
  });

  it('optimisticVoteComment neutral: harus menghapus userId dari upVotesBy komentar', () => {
    const prevState = {
      ...initialState,
      thread: {
        ...mockThread,
        comments: [{ ...mockComment, upVotesBy: ['user-1'] }],
      },
    };
    const state = threadDetailReducer(
      prevState,
      optimisticVoteComment({ commentId: 'comment-1', voteType: 'neutral', userId: 'user-1' }),
    );
    expect(state.thread.comments[0].upVotesBy).not.toContain('user-1');
  });

  it('fetchThreadDetail.pending: harus mengatur loading true dan thread null', () => {
    const state = threadDetailReducer(
      { ...initialState, thread: mockThread },
      { type: fetchThreadDetail.pending.type },
    );
    expect(state.loading).toBe(true);
    expect(state.thread).toBeNull();
  });

  it('fetchThreadDetail.fulfilled: harus mengisi thread dan loading false', () => {
    const state = threadDetailReducer(
      { ...initialState, loading: true },
      { type: fetchThreadDetail.fulfilled.type, payload: mockThread },
    );
    expect(state.loading).toBe(false);
    expect(state.thread).toEqual(mockThread);
  });

  it('createComment.fulfilled: harus menambahkan komentar baru ke thread.comments', () => {
    const newComment = {
      id: 'comment-2', content: 'New', upVotesBy: [], downVotesBy: [],
    };
    const prevState = { ...initialState, thread: { ...mockThread, comments: [mockComment] } };
    const state = threadDetailReducer(
      prevState,
      { type: createComment.fulfilled.type, payload: newComment },
    );
    expect(state.thread.comments).toHaveLength(2);
    expect(state.thread.comments[1].id).toBe('comment-2');
  });
});
