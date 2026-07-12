/**
 * Integration tests untuk Thunk Function di authSlice
 *
 * Skenario:
 * - loginUser berhasil: harus menyimpan token, dispatch fulfilled, dan mengisi state.user
 * - loginUser gagal: harus dispatch rejected dan mengisi state.error
 * - fetchCurrentUser berhasil: harus mengisi state.user dari API
 * - fetchCurrentUser gagal: harus mengatur state.user null dan menghapus token
 * - logout: harus mengosongkan state.user dan menghapus token dari localStorage
 */

import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, {
  loginUser, fetchCurrentUser, logout,
} from '../store/authSlice';
import api from '../utils/api';

vi.mock('../utils/api');

const buildStore = () => configureStore({ reducer: { auth: authReducer } });

const mockUser = {
  id: 'user-1', name: 'Alice', email: 'alice@test.com', avatar: '',
};

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe('authSlice thunks', () => {
  it('loginUser berhasil: harus mengisi state.user dan menyimpan token', async () => {
    api.login.mockResolvedValue({ token: 'fake-token' });
    api.getOwnProfile.mockResolvedValue({ user: mockUser });

    const store = buildStore();
    await store.dispatch(loginUser({ email: 'alice@test.com', password: 'secret' }));

    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(store.getState().auth.user).toEqual(mockUser);
    expect(store.getState().auth.loading).toBe(false);
  });

  it('loginUser gagal: harus mengisi state.error', async () => {
    api.login.mockRejectedValue(new Error('Email atau password salah'));

    const store = buildStore();
    await store.dispatch(loginUser({ email: 'wrong@test.com', password: 'wrong' }));

    expect(store.getState().auth.user).toBeNull();
    expect(store.getState().auth.error).toBe('Email atau password salah');
    expect(store.getState().auth.loading).toBe(false);
  });

  it('fetchCurrentUser berhasil: harus mengisi state.user', async () => {
    api.getOwnProfile.mockResolvedValue({ user: mockUser });

    const store = buildStore();
    await store.dispatch(fetchCurrentUser());

    expect(store.getState().auth.user).toEqual(mockUser);
  });

  it('fetchCurrentUser gagal: harus mengatur user null dan menghapus token', async () => {
    localStorage.setItem('token', 'expired-token');
    api.getOwnProfile.mockRejectedValue(new Error('Unauthorized'));

    const store = buildStore();
    await store.dispatch(fetchCurrentUser());

    expect(store.getState().auth.user).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('logout: harus mengosongkan state.user dan menghapus token', () => {
    localStorage.setItem('token', 'fake-token');
    const store = buildStore();
    store.dispatch(logout());

    expect(store.getState().auth.user).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
