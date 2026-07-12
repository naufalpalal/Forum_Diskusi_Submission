/**
 * Unit tests untuk komponen VoteButtons
 *
 * Skenario:
 * - Menampilkan jumlah upvote dan downvote dengan benar
 * - Tombol upvote memiliki class active-up ketika userId ada di upVotesBy
 * - Tombol downvote memiliki class active-down ketika userId ada di downVotesBy
 * - Klik upvote memanggil onVote('up') jika belum di-upvote
 * - Klik upvote memanggil onVote('neutral') jika sudah di-upvote (toggle off)
 * - Klik downvote memanggil onVote('down') jika belum di-downvote
 */

import {
  describe, it, expect, vi,
} from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import VoteButtons from '../components/VoteButtons';

const USER_ID = 'user-1';

describe('VoteButtons component', () => {
  it('harus menampilkan jumlah upvote dan downvote', () => {
    render(
      <VoteButtons
        upVotesBy={['user-2', 'user-3']}
        downVotesBy={['user-4']}
        userId={USER_ID}
        onVote={vi.fn()}
      />,
    );
    expect(screen.getByLabelText('upvote')).toHaveTextContent('2');
    expect(screen.getByLabelText('downvote')).toHaveTextContent('1');
  });

  it('tombol upvote harus memiliki class active-up jika userId ada di upVotesBy', () => {
    render(
      <VoteButtons
        upVotesBy={[USER_ID]}
        downVotesBy={[]}
        userId={USER_ID}
        onVote={vi.fn()}
      />,
    );
    expect(screen.getByLabelText('upvote')).toHaveClass('active-up');
  });

  it('tombol downvote harus memiliki class active-down jika userId ada di downVotesBy', () => {
    render(
      <VoteButtons
        upVotesBy={[]}
        downVotesBy={[USER_ID]}
        userId={USER_ID}
        onVote={vi.fn()}
      />,
    );
    expect(screen.getByLabelText('downvote')).toHaveClass('active-down');
  });

  it('klik upvote harus memanggil onVote("up") jika belum di-upvote', () => {
    const onVote = vi.fn();
    render(
      <VoteButtons
        upVotesBy={['user-2']}
        downVotesBy={[]}
        userId={USER_ID}
        onVote={onVote}
      />,
    );
    fireEvent.click(screen.getByLabelText('upvote'));
    expect(onVote).toHaveBeenCalledWith('up');
  });

  it('klik upvote harus memanggil onVote("neutral") jika sudah di-upvote', () => {
    const onVote = vi.fn();
    render(
      <VoteButtons
        upVotesBy={[USER_ID]}
        downVotesBy={[]}
        userId={USER_ID}
        onVote={onVote}
      />,
    );
    fireEvent.click(screen.getByLabelText('upvote'));
    expect(onVote).toHaveBeenCalledWith('neutral');
  });

  it('klik downvote harus memanggil onVote("down") jika belum di-downvote', () => {
    const onVote = vi.fn();
    render(
      <VoteButtons
        upVotesBy={['user-2']}
        downVotesBy={[]}
        userId={USER_ID}
        onVote={onVote}
      />,
    );
    fireEvent.click(screen.getByLabelText('downvote'));
    expect(onVote).toHaveBeenCalledWith('down');
  });
});
