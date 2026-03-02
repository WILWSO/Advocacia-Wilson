/**
 * Tests for DNIInput component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DNIInput } from '../src/components/domain/argentine/DNIInput';

describe('DNIInput', () => {
  it('renders with label', () => {
    render(<DNIInput name="dni" label="DNI" />);
    expect(screen.getByLabelText(/DNI/i)).toBeInTheDocument();
  });

  it('formats DNI input', () => {
    const { container } = render(<DNIInput name="dni" label="DNI" />);
    const input = container.querySelector('input[name="dni"]') as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: '12345678' } });
    
    // Should format to 12.345.678
    expect(input.value).toMatch(/\d{1,2}\.\d{3}\.\d{3}/);
  });

  it('shows required indicator when required', () => {
    render(<DNIInput name="dni" label="DNI" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('accepts allowFormatted prop', () => {
    const { container } = render(
      <DNIInput name="dni" label="DNI" allowFormatted={false} />
    );
    
    expect(container.querySelector('input')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<DNIInput ref={ref} name="dni" label="DNI" />);
    
    expect(ref).toHaveBeenCalled();
  });
});
