/**
 * FieldGroup Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FieldGroup } from '../src/components/field/FieldGroup';
import type { Validator, Formatter } from '@wsolutions/form-validation';

describe('FieldGroup', () => {
  // Mock validators
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

  // Mock formatter
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

  it('should render label and input', () => {
    render(
      <FieldGroup
        name="test-field"
        label="Test Field"
        validator={mockValidValidator}
      />
    );

    expect(screen.getByLabelText('Test Field')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should show required indicator when required', () => {
    render(
      <FieldGroup
        name="test-field"
        label="Test Field"
        validator={mockValidValidator}
        required
      />
    );

    const requiredIndicator = screen.getByText('*');
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveClass('required-indicator');
  });

  it('should show help text when provided', () => {
    render(
      <FieldGroup
        name="test-field"
        label="Test Field"
        validator={mockValidValidator}
        helpText="This is a help text"
      />
    );

    expect(screen.getByText('This is a help text')).toBeInTheDocument();
  });

  it('should show error message after validation fails', async () => {
    render(
      <FieldGroup
        name="test-field"
        label="Test Field"
        validator={mockInvalidValidator}
        showErrorOnBlur
      />
    );

    const input = screen.getByRole('textbox');
    
    // Type something and blur
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Value is invalid');
    });
  });

  it('should hide help text when error is shown', async () => {
    render(
      <FieldGroup
        name="test-field"
        label="Test Field"
        validator={mockInvalidValidator}
        helpText="This is help text"
        showErrorOnBlur
      />
    );

    const input = screen.getByRole('textbox');
    
    // Initially help text is visible
    expect(screen.getByText('This is help text')).toBeInTheDocument();
    
    // Type something and blur
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.queryByText('This is help text')).not.toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('should format value when formatter is provided', () => {
    const { container } = render(
      <FieldGroup
        name="test-field"
        label="Test Field"
        validator={mockValidValidator}
        formatter={upperCaseFormatter}
        initialValue="hello"
        formatOnMount
      />
    );

    const input = container.querySelector('input') as HTMLInputElement;
    // After formatting, value should be uppercase
    expect(input).toBeInTheDocument();
  });

  it('should set proper ARIA attributes', () => {
    render(
      <FieldGroup
        name="test-field"
        label="Test Field"
        validator={mockValidValidator}
        helpText="Help text"
        required
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(input).toHaveAttribute('id', 'field-test-field');
  });

  it('should call onChange callback', () => {
    const onChange = vi.fn();
    
    render(
      <FieldGroup
        name="test-field"
        label="Test Field"
        validator={mockValidValidator}
        onChange={onChange}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(onChange).toHaveBeenCalled();
  });

  it('should use custom error renderer', async () => {
    const renderError = vi.fn((error) => (
      <strong data-testid="custom-error">{error}</strong>
    ));
    
    render(
      <FieldGroup
        name="test-field"
        label="Test Field"
        validator={mockInvalidValidator}
        renderError={renderError}
        showErrorOnBlur
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.getByTestId('custom-error')).toHaveTextContent('Value is invalid');
      expect(renderError).toHaveBeenCalledWith('Value is invalid');
    });
  });
});
