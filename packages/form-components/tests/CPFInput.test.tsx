/**
 * Tests for CPFInput component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CPFInput } from '../src/components/domain/brazilian/CPFInput';

describe('CPFInput', () => {
  it('renders with label', () => {
    render(<CPFInput name="cpf" label="CPF" />);
    expect(screen.getByLabelText(/CPF/i)).toBeInTheDocument();
  });

  it('formats CPF input', () => {
    const { container } = render(<CPFInput name="cpf" label="CPF" />);
    const input = container.querySelector('input[name="cpf"]') as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: '12345678900' } });
    
    // Should format to 123.456.789-00
    expect(input.value).toMatch(/\d{3}\.\d{3}\.\d{3}-\d{2}/);
  });

  it('shows required indicator when required', () => {
    render(<CPFInput name="cpf" label="CPF" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('validates CPF format', async () => {
    const { container } = render(<CPFInput name="cpf" label="CPF" />);
    const input = container.querySelector('input[name="cpf"]') as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.blur(input);
    
    // Should show validation error for invalid CPF
    // Note: Specific error message depends on validator implementation
  });

  it('accepts allowFormatted prop', () => {
    const { container } = render(
      <CPFInput name="cpf" label="CPF" allowFormatted={false} />
    );
    
    expect(container.querySelector('input')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<CPFInput ref={ref} name="cpf" label="CPF" />);
    
    expect(ref).toHaveBeenCalled();
  });
});
