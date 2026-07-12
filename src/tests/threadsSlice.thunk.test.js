/**
 * Integration tests untuk Thunk Function di threadsSlice
 *
 * Skenario:
 * - fetchThreads berhasil: harus mengisi state.items dan state.users
 * - fetchThreads gagal: harus mengisi state.error
 * - createThread berhasil: harus menambahkan thread baru ke awal state.items
 * - voteThread upvote: harus memanggil api.upVoteThread dengan threadId yang benar
 */

import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import threadsReducer, { fetchThreads, createThread, voteThread } from '../store/threadsSlice';
import api from '../utils/api';

vi.mock('../utils/api');

const buildStore = () => configureStore({ reducer: { threads: threadsReducer } });

const mockThread = {
  id: 'thread-1',
  title: 'Hello',
  body: 'World',
  category: 'general',
  upVotesBy: [],
  downVotesBy: [],
  totalComments: 0,
  createdAt: new Date().toISOString(),
  ownerId: 'user-1',
};

beforeEach(() => vi.clearAllMocks());

describe('threadsSlice thunks', () => {
  it('fetchThreads berhasil: harus mengisi items dan users', async () => {
    api.getThreads.mockResolvedValue({ threads: [mockThread] });
    api.getUsers.mockResolvedValue({ users: [{ id: 'user-1', name: 'Alice' }] });

    const store = buildStore();
    await store.dispatch(fetchThreads());

    const { items, users, loading } = store.getState().threads;
    expect(loading).toBe(false);
    expect(items).toHaveLength(1);
    expect(users).toHaveLength(1);
  });

  it('fetchThreads gagal: harus mengisi state.error', async () => {
    api.getThreads.mockRejectedValue(new Error('Server Error'));

    const store = buildStore();
    await store.dispatch(fetchThreads());

    expect(store.getState().threads.error).toBe('Server Error');
    expect(store.getState().threads.loading).toBe(false);
  });

  it('createThread berhasil: harus menambahkan thread baru ke awal items', async () => {
    const newThread = { ...mockThread, id: 'thread-2', title: 'New Thread' };
    api.createThread.mockResolvedValue({ thread: newThread });

    const store = buildStore();
    await store.dispatch(createThread({ title: 'New Thread', body: 'Body', category: 'general' }));

    expect(store.getState().threads.items[0].id).toBe('thread-2');
  });

  it('voteThread upvote: harus memanggil api.upVoteThread', async () => {
    api.upVoteThread.mockResolvedValue({});

    const store = buildStore();
    await store.dispatch(voteThread({ threadId: 'thread-1', voteType: 'up' }));

    expect(api.upVoteThread).toHaveBeenCalledWith('thread-1');
  });
});
