/**
 * Unit tests for threadsSlice reducer
 *
 * Skenario:
 * - setCategoryFilter: mengubah nilai categoryFilter di state
 * - optimisticVoteThread upvote: menambahkan userId ke upVotesBy dan menghapus dari downVotesBy
 * - optimisticVoteThread downvote: menambahkan userId ke downVotesBy dan menghapus dari upVotesBy
 * - optimisticVoteThread neutral: menghapus userId dari upVotesBy dan downVotesBy
 * - fetchThreads.pending: mengatur loading true dan error null
 * - fetchThreads.fulfilled: mengisi items dan users, loading false
 * - fetchThreads.rejected: mengatur error dan loading false
 */

import { describe, it, expect } from 'vitest';
import threadsReducer, {
  setCategoryFilter,
  optimisticVoteThread,
  fetchThreads,
} from '../store/threadsSlice';

const initialState = {
  items: [], users: [], loading: false, error: null, categoryFilter: '',
};

const mockThread = {
  id: 'thread-1',
  title: 'Test Thread',
  body: 'Body',
  category: 'general',
  upVotesBy: ['user-2'],
  downVotesBy: [],
  totalComments: 0,
  createdAt: new Date().toISOString(),
  ownerId: 'user-1',
};

describe('threadsSlice reducer', () => {
  it('setCategoryFilter: harus mengubah categoryFilter sesuai payload', () => {
    const state = threadsReducer(initialState, setCategoryFilter('react'));
    expect(state.categoryFilter).toBe('react');
  });

  it('setCategoryFilter: harus mereset categoryFilter ke string kosong', () => {
    const prevState = { ...initialState, categoryFilter: 'react' };
    const state = threadsReducer(prevState, setCategoryFilter(''));
    expect(state.categoryFilter).toBe('');
  });

  it('optimisticVoteThread upvote: harus menambahkan userId ke upVotesBy', () => {
    const prevState = { ...initialState, items: [{ ...mockThread }] };
    const state = threadsReducer(
      prevState,
      optimisticVoteThread({ threadId: 'thread-1', voteType: 'up', userId: 'user-1' }),
    );
    expect(state.items[0].upVotesBy).toContain('user-1');
    expect(state.items[0].downVotesBy).not.toContain('user-1');
  });

  it('optimisticVoteThread downvote: harus menambahkan userId ke downVotesBy dan menghapus dari upVotesBy', () => {
    const prevState = {
      ...initialState,
      items: [{ ...mockThread, upVotesBy: ['user-1'], downVotesBy: [] }],
    };
    const state = threadsReducer(
      prevState,
      optimisticVoteThread({ threadId: 'thread-1', voteType: 'down', userId: 'user-1' }),
    );
    expect(state.items[0].downVotesBy).toContain('user-1');
    expect(state.items[0].upVotesBy).not.toContain('user-1');
  });

  it('optimisticVoteThread neutral: harus menghapus userId dari upVotesBy dan downVotesBy', () => {
    const prevState = {
      ...initialState,
      items: [{ ...mockThread, upVotesBy: ['user-1'], downVotesBy: ['user-1'] }],
    };
    const state = threadsReducer(
      prevState,
      optimisticVoteThread({ threadId: 'thread-1', voteType: 'neutral', userId: 'user-1' }),
    );
    expect(state.items[0].upVotesBy).not.toContain('user-1');
    expect(state.items[0].downVotesBy).not.toContain('user-1');
  });

  it('fetchThreads.pending: harus mengatur loading true dan error null', () => {
    const state = threadsReducer(
      { ...initialState, error: 'previous error' },
      { type: fetchThreads.pending.type },
    );
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchThreads.fulfilled: harus mengisi items dan users', () => {
    const payload = { threads: [mockThread], users: [{ id: 'user-1', name: 'Alice' }] };
    const state = threadsReducer(
      { ...initialState, loading: true },
      { type: fetchThreads.fulfilled.type, payload },
    );
    expect(state.loading).toBe(false);
    expect(state.items).toHaveLength(1);
    expect(state.users).toHaveLength(1);
  });

  it('fetchThreads.rejected: harus mengatur error dan loading false', () => {
    const state = threadsReducer(
      { ...initialState, loading: true },
      { type: fetchThreads.rejected.type, error: { message: 'Network Error' } },
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Network Error');
  });
});
