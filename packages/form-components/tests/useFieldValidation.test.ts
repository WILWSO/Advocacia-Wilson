/**
 * useFieldValidation Hook Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useFieldValidation } from '../src/hooks/validation/useFieldValidation';
import type { Validator, Formatter } from '@wsolutions/form-validation';

describe('useFieldValidation', () => {
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

  // Mock formatters
  const upperCaseFormatter: Formatter<string> = {
    config: {
      name: 'uppercase',
      format: (value: string) => value.toUpperCase(),
      unformat: (value: string) => value,
    },
    format: (value: string) => value.toUpperCase(),
    unformat: (value: string) => value,
    getName: () => 'uppercase',
  };

  it('should initialize with default values', () => {
    const { result } = renderHook(() => 
      useFieldValidation({
        validator: mockValidValidator,
      })
    );

    expect(result.current.value).toBe('');
    expect(result.current.formattedValue).toBe('');
    expect(result.current.rawValue).toBe('');
    expect(result.current.isValid).toBe(false);
    expect(result.current.isInvalid).toBe(false);
    expect(result.current.error).toBeUndefined();
    expect(result.current.isTouched).toBe(false);
    expect(result.current.isDirty).toBe(false);
  });

  it('should handle validation with validator', async () => {
    const { result } = renderHook(() => 
      useFieldValidation({
        validator: mockValidValidator,
      })
    );

    await act(async () => {
      await result.current.validate('test');
    });

    expect(result.current.isValid).toBe(true);
    expect(result.current.isInvalid).toBe(false);
  });

  it('should handle formatting with formatter', () => {
    const { result } = renderHook(() => 
      useFieldValidation({
        validator: mockValidValidator,
        formatter: upperCaseFormatter,
      })
    );

    act(() => {
      result.current.setValue('hello');
    });

    expect(result.current.formattedValue).toBe('HELLO');
    expect(result.current.rawValue).toBe('hello');
  });

  it('should validate and format together', async () => {
    const { result } = renderHook(() => 
      useFieldValidation({
        validator: mockValidValidator,
        formatter: upperCaseFormatter,
      })
    );

    await act(async () => {
      result.current.setValue('test');
      await result.current.validate();
    });

    expect(result.current.formattedValue).toBe('TEST');
    expect(result.current.isValid).toBe(true);
  });

  it('should track dirty state', () => {
    const { result } = renderHook(() => 
      useFieldValidation({
        validator: mockValidValidator,
        initialValue: '',
      })
    );

    expect(result.current.isDirty).toBe(false);

    act(() => {
      result.current.setValue('changed');
    });

    expect(result.current.isDirty).toBe(true);

    act(() => {
      result.current.reset();
    });

    expect(result.current.isDirty).toBe(false);
  });

  it('should track touched state', () => {
    const { result } = renderHook(() => 
      useFieldValidation({
        validator: mockValidValidator,
      })
    );

    expect(result.current.isTouched).toBe(false);

    act(() => {
      result.current.setTouched(true);
    });

    expect(result.current.isTouched).toBe(true);
  });

  it('should handle onChange events', async () => {
    const { result } = renderHook(() => 
      useFieldValidation({
        validator: mockValidValidator,
        formatter: upperCaseFormatter,
      })
    );

    const mockEvent = {
      target: { value: 'hello' },
      currentTarget: { value: 'hello' },
    } as React.ChangeEvent<HTMLInputElement>;

    await act(async () => {
      await result.current.handleChange(mockEvent);
    });

    expect(result.current.formattedValue).toBe('HELLO');
  });

  it('should handle onBlur events', async () => {
    const { result } = renderHook(() => 
      useFieldValidation({
        validator: mockInvalidValidator,
        showErrorOnBlur: true,
      })
    );

    const mockEvent = {
      target: { value: 'test' },
      currentTarget: { value: 'test' },
    } as React.FocusEvent<HTMLInputElement>;

    await act(async () => {
      result.current.setValue('test');
      await result.current.handleBlur(mockEvent);
    });

    expect(result.current.isTouched).toBe(true);
    expect(result.current.error).toBe('Value is invalid');
  });

  it('should call custom onChange handler', async () => {
    const customOnChange = vi.fn();
    const { result } = renderHook(() => 
      useFieldValidation({
        validator: mockValidValidator,
        onChange: customOnChange,
      })
    );

    const mockEvent = {
      target: { value: 'test' },
      currentTarget: { value: 'test' },
    } as React.ChangeEvent<HTMLInputElement>;

    await act(async () => {
      await result.current.handleChange(mockEvent);
    });

    expect(customOnChange).toHaveBeenCalled();
  });

  it('should call custom onBlur handler', async () => {
    const customOnBlur = vi.fn();
    const { result } = renderHook(() => 
      useFieldValidation({
        validator: mockValidValidator,
        onBlur: customOnBlur,
      })
    );

    const mockEvent = {
      target: { value: 'test' },
      currentTarget: { value: 'test' },
    } as React.FocusEvent<HTMLInputElement>;

    await act(async () => {
      await result.current.handleBlur(mockEvent);
    });

    expect(customOnBlur).toHaveBeenCalled();
  });

  it('should call onValidation callback', async () => {
    const onValidation = vi.fn();
    const { result } = renderHook(() => 
      useFieldValidation({
        validator: mockValidValidator,
        onValidation,
      })
    );

    await act(async () => {
      await result.current.validate('test');
    });

    expect(onValidation).toHaveBeenCalledWith(
      expect.objectContaining({ isValid: true }),
      'test'
    );
  });

  it('should provide inputProps object', () => {
    const { result } = renderHook(() => 
      useFieldValidation({
        validator: mockValidValidator,
      })
    );

    expect(result.current.inputProps).toBeDefined();
    expect(result.current.inputProps).toHaveProperty('value');
    expect(result.current.inputProps).toHaveProperty('onChange');
    expect(result.current.inputProps).toHaveProperty('onBlur');
  });

  it('should reset all state', async () => {
    const { result } = renderHook(() => 
      useFieldValidation({
        validator: mockInvalidValidator,
      })
    );

    await act(async () => {
      result.current.setValue('test');
      await result.current.validate();
      result.current.setTouched(true);
    });

    expect(result.current.isDirty).toBe(true);
    expect(result.current.isTouched).toBe(true);

    act(() => {
      result.current.reset();
    });

    expect(result.current.value).toBe('');
    expect(result.current.isDirty).toBe(false);
    expect(result.current.isTouched).toBe(false);
    expect(result.current.validation).toBeUndefined();
  });

  it('should validate on mount when validateOnMount is true', async () => {
    const validator = {
      ...mockValidValidator,
      validate: vi.fn().mockResolvedValue({ isValid: true }),
    };

    renderHook(() => 
      useFieldValidation({
        validator,
        validateOnMount: true,
        initialValue: 'test',
      })
    );

    await waitFor(() => {
      expect(validator.validate).toHaveBeenCalled();
    });
  });

  it('should format on mount when formatOnMount is true', () => {
    const { result } = renderHook(() => 
      useFieldValidation({
        validator: mockValidValidator,
        formatter: upperCaseFormatter,
        formatOnMount: true,
        initialValue: 'hello',
      })
    );

    expect(result.current.formattedValue).toBe('HELLO');
  });
});
