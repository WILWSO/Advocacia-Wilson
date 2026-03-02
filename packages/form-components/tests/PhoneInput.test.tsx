/**
 * Tests for PhoneInput component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PhoneInput } from '../src/components/domain/universal/PhoneInput';

describe('PhoneInput', () => {
  it('renders with label', () => {
    render(<PhoneInput name="phone" label="Telefone" />);
    expect(screen.getByLabelText(/Telefone/i)).toBeInTheDocument();
  });

  it('renders country selector', () => {
    render(<PhoneInput name="phone" label="Telefone" />);
    expect(screen.getByLabelText(/Selecione o país/i)).toBeInTheDocument();
  });

  it('changes country', () => {
    const onCountryChange = vi.fn();
    render(
      <PhoneInput 
        name="phone" 
        label="Telefone" 
        onCountryChange={onCountryChange}
      />
    );
    
    const select = screen.getByLabelText(/Selecione o país/i);
    fireEvent.change(select, { target: { value: 'AR' } });
    
    expect(onCountryChange).toHaveBeenCalledWith('AR');
  });

  it('formats Brazilian phone number', () => {
    const { container } = render(
      <PhoneInput name="phone" label="Telefone" defaultCountry="BR" />
    );
    
    const input = container.querySelector('input[type="tel"]') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '11987654321' } });
    
    // Should format Brazilian phone
    expect(input.value).toMatch(/\(\d{2}\)\s?\d{4,5}-?\d{4}/);
  });

  it('shows required indicator when required', () => {
    render(<PhoneInput name="phone" label="Telefone" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('calls onChange with formatted, raw and country values', () => {
    const onChange = vi.fn();
    const { container } = render(
      <PhoneInput 
        name="phone" 
        label="Telefone" 
        onChange={onChange}
        defaultCountry="BR"
      />
    );
    
    const input = container.querySelector('input[type="tel"]') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '11987654321' } });
    
    // Should call onChange with formatted, raw, and country
    expect(onChange).toHaveBeenCalled();
    // Check that it receives 3 arguments
    expect(onChange.mock.calls[0]).toHaveLength(3);
    expect(onChange.mock.calls[0][2]).toBe('BR');
  });

  it('limits countries list when provided', () => {
    render(
      <PhoneInput 
        name="phone" 
        label="Telefone" 
        countries={['BR', 'AR']}
      />
    );
    
    const select = screen.getByLabelText(/Selecione o país/i);
    const options = select.querySelectorAll('option');
    
    expect(options).toHaveLength(2);
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<PhoneInput ref={ref} name="phone" label="Telefone" />);
    
    expect(ref).toHaveBeenCalled();
  });
});
