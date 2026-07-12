/**
 * Unit tests untuk komponen Navbar
 *
 * Skenario:
 * - Menampilkan link Login dan Register ketika user belum login
 * - Menampilkan nama user dan tombol Logout ketika user sudah login
 * - Klik Logout harus men-dispatch action logout dan navigasi ke /login
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Navbar from '../components/Navbar';
import authReducer from '../store/authSlice';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

const buildStore = (user = null) => configureStore({
  reducer: { auth: authReducer },
  preloadedState: { auth: { user, loading: false, error: null } },
});

describe('Navbar component', () => {
  it('harus menampilkan link Login dan Register ketika belum login', () => {
    render(
      <Provider store={buildStore()}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('harus menampilkan nama user dan tombol Logout ketika sudah login', () => {
    const user = { id: 'user-1', name: 'Alice', avatar: 'https://avatar.url' };
    render(
      <Provider store={buildStore(user)}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });

  it('klik Logout harus navigasi ke /login', () => {
    const user = { id: 'user-1', name: 'Alice', avatar: '' };
    render(
      <Provider store={buildStore(user)}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>,
    );
    fireEvent.click(screen.getByText('Logout'));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
