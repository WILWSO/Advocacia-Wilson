/**
 * Tests for EmailInput component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EmailInput } from '../src/components/domain/universal/EmailInput';

describe('EmailInput', () => {
  it('renders with label', () => {
    render(<EmailInput name="email" label="Email" />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  });

  it('validates email format', async () => {
    render(<EmailInput name="email" label="Email" />);
    const input = screen.getByLabelText(/Email/i) as HTMLInputElement;
    
    // Invalid email
    fireEvent.change(input, { target: { value: 'invalid-email' } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('accepts valid email', async () => {
    render(<EmailInput name="email" label="Email" />);
    const input = screen.getByLabelText(/Email/i) as HTMLInputElement;
    
    // Valid email
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  it('shows required indicator when required', () => {
    render(<EmailInput name="email" label="Email" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('respects maxLength prop', () => {
    render(<EmailInput name="email" label="Email" maxLength={50} />);
    const input = screen.getByLabelText(/Email/i) as HTMLInputElement;
    
    expect(input).toHaveAttribute('maxLength', '50');
  });

  it('accepts allowDisposable prop', () => {
    const { container } = render(
      <EmailInput name="email" label="Email" allowDisposable />
    );
    
    expect(container.querySelector('input')).toBeInTheDocument();
  });

  it('accepts requireTld prop', () => {
    const { container } = render(
      <EmailInput name="email" label="Email" requireTld={false} />
    );
    
    expect(container.querySelector('input')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<EmailInput ref={ref} name="email" label="Email" />);
    
    expect(ref).toHaveBeenCalled();
  });

  it('has correct input type', () => {
    render(<EmailInput name="email" label="Email" />);
    const input = screen.getByLabelText(/Email/i) as HTMLInputElement;
    
    expect(input).toHaveAttribute('type', 'email');
  });
});
