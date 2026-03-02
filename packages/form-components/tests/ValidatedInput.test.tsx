/**
 * ValidatedInput Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ValidatedInput } from '../src/components/input/ValidatedInput';
import type { Validator } from '@wsolutions/form-validation';

describe('ValidatedInput', () => {
  // Mock valid validator
  const mockValidValidator: Validator<string> = {
    config: {
      name: 'mock-valid',
      message: 'Invalid value',
      async: false,
      validate: () => ({ isValid: true }),
    },
    validate: async () => ({ isValid: true }),
    getName: () => 'mock-valid',
    getMessage: () => 'Invalid value',
    isAsync: () => false,
  };

  // Mock invalid validator
  const mockInvalidValidator: Validator<string> = {
    config: {
      name: 'mock-invalid',
      message: 'Value is invalid',
      async: false,
      validate: () => ({ isValid: false, error: 'Value is invalid' }),
    },
    validate: async () => ({ isValid: false, error: 'Value is invalid' }),
    getName: () => 'mock-invalid',
    getMessage: () => 'Value is invalid',
    isAsync: () => false,
  };

  it('should render input with value', () => {
    const onChange = vi.fn();
    
    render(
      <ValidatedInput
        validator={mockValidValidator}
        value="test"
        onChange={onChange}
        placeholder="Enter text"
      />
    );

    const input = screen.getByPlaceholderText('Enter text') as HTMLInputElement;
    expect(input.value).toBe('test');
  });

  it('should call onChange when value changes', () => {
    const onChange = vi.fn();
    
    render(
      <ValidatedInput
        validator={mockValidValidator}
        value=""
        onChange={onChange}
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(onChange).toHaveBeenCalledWith('new value');
  });

  it('should show error message for invalid value after blur', async () => {
    const onChange = vi.fn();
    
    render(
      <ValidatedInput
        validator={mockInvalidValidator}
        value="test"
        onChange={onChange}
        showErrorOnBlur
      />
    );

    const input = screen.getByRole('textbox');
    
    // Initially no error
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    // After blur, error should appear
    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Value is invalid');
    });
  });

  it('should apply valid className when valid and touched', async () => {
    const onChange = vi.fn();
    
    render(
      <ValidatedInput
        validator={mockValidValidator}
        value="test"
        onChange={onChange}
        showValidationState
        validClassName="is-valid"
        className="input"
      />
    );

    const input = screen.getByRole('textbox');
    
    // Trigger blur to mark as touched
    fireEvent.blur(input);

    await waitFor(() => {
      expect(input).toHaveClass('input');
      expect(input).toHaveClass('is-valid');
    });
  });

  it('should apply invalid className when invalid and touched', async () => {
    const onChange = vi.fn();
    
    render(
      <ValidatedInput
        validator={mockInvalidValidator}
        value="test"
        onChange={onChange}
        showValidationState
        invalidClassName="is-invalid"
        className="input"
      />
    );

    const input = screen.getByRole('textbox');
    
    // Trigger blur to mark as touched
    fireEvent.blur(input);

    await waitFor(() => {
      expect(input).toHaveClass('input');
      expect(input).toHaveClass('is-invalid');
    });
  });

  it('should render with container when containerClassName is provided', () => {
    const onChange = vi.fn();
    
    const { container } = render(
      <ValidatedInput
        validator={mockValidValidator}
        value="test"
        onChange={onChange}
        containerClassName="input-container"
      />
    );

    const containerDiv = container.querySelector('.input-container');
    expect(containerDiv).toBeInTheDocument();
  });

  it('should use custom error renderer', async () => {
    const onChange = vi.fn();
    const renderError = vi.fn((error) => <strong data-testid="custom-error">{error}</strong>);
    
    render(
      <ValidatedInput
        validator={mockInvalidValidator}
        value="test"
        onChange={onChange}
        showErrorOnBlur
        renderError={renderError}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.getByTestId('custom-error')).toHaveTextContent('Value is invalid');
      expect(renderError).toHaveBeenCalledWith('Value is invalid');
    });
  });

  it('should set aria-invalid when field is invalid', async () => {
    const onChange = vi.fn();
    
    render(
      <ValidatedInput
        validator={mockInvalidValidator}
        value="test"
        onChange={onChange}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.blur(input);

    await waitFor(() => {
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });
});
