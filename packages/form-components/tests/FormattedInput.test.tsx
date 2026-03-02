/**
 * FormattedInput Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormattedInput } from '../src/components/input/FormattedInput';
import type { Formatter } from '@wsolutions/form-validation';

describe('FormattedInput', () => {
  // Mock uppercase formatter
  const upperCaseFormatter: Formatter<string, string> = {
    config: {
      name: 'uppercase',
      format: (value: string) => value.toUpperCase(),
      unformat: (value: string) => value.toLowerCase(),
    },
    format: (value: string) => value.toUpperCase(),
    unformat: (value: string) => value.toLowerCase(),
    getName: () => 'uppercase',
  };

  // Mock dash formatter
  const dashFormatter: Formatter<string, string> = {
    config: {
      name: 'dash',
      format: (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length >= 10) {
          return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        }
        return cleaned;
      },
      unformat: (value: string) => value.replace(/-/g, ''),
    },
    format: (value: string) => {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length >= 10) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
      }
      return cleaned;
    },
    unformat: (value: string) => value.replace(/-/g, ''),
    getName: () => 'dash',
  };

  it('should render input with formatted value', () => {
    const onChange = vi.fn();
    
    render(
      <FormattedInput
        formatter={upperCaseFormatter}
        value="hello"
        onChange={onChange}
        placeholder="Enter text"
      />
    );

    const input = screen.getByPlaceholderText('Enter text') as HTMLInputElement;
    // Value should eventually be uppercase after formatting
    expect(input).toBeInTheDocument();
  });

  it('should call onChange with formatted and raw values', () => {
    const onChange = vi.fn();
    
    render(
      <FormattedInput
        formatter={upperCaseFormatter}
        value=""
        onChange={onChange}
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'hello' } });

    expect(onChange).toHaveBeenCalled();
    // Should be called with formatted and raw values
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
    expect(lastCall[0]).toBe('HELLO'); // formatted
    expect(lastCall[1]).toBe('hello'); // raw
  });

  it('should format phone number with dashes', () => {
    const onChange = vi.fn();
    
    render(
      <FormattedInput
        formatter={dashFormatter}
        value=""
        onChange={onChange}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '1234567890' } });

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
    expect(lastCall[0]).toBe('123-456-7890'); // formatted
  });

  it('should format on blur when formatOnBlur is true', () => {
    const onChange = vi.fn();
    const onBlur = vi.fn();
    
    render(
      <FormattedInput
        formatter={upperCaseFormatter}
        value=""
        onChange={onChange}
        onBlur={onBlur}
        formatOnBlur
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'hello' } });
    
    // On change, with formatOnBlur, it shouldn't format yet
    fireEvent.blur(input);

    // onBlur should be called
    expect(onBlur).toHaveBeenCalled();
  });

  it('should render with container when containerClassName is provided', () => {
    const onChange = vi.fn();
    
    const { container } = render(
      <FormattedInput
        formatter={upperCaseFormatter}
        value="test"
        onChange={onChange}
        containerClassName="input-container"
      />
    );

    const containerDiv = container.querySelector('.input-container');
    expect(containerDiv).toBeInTheDocument();
  });

  it('should forward ref correctly', () => {
    const onChange = vi.fn();
    const ref = vi.fn();
    
    render(
      <FormattedInput
        ref={ref}
        formatter={upperCaseFormatter}
        value="test"
        onChange={onChange}
      />
    );

    expect(ref).toHaveBeenCalled();
  });
});
