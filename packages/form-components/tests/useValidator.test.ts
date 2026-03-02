/**
 * useValidator Hook Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useValidator } from '../src/hooks/validation/useValidator';
import type { Validator, ValidationResult } from '@wsolutions/form-validation';

describe('useValidator', () => {
  // Mock validator that always validates as true
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

  // Mock validator that always validates as false
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

  it('should initialize with null validation', () => {
    const { result } = renderHook(() => useValidator(mockValidValidator));

    expect(result.current.validation).toBeNull();
    expect(result.current.isValid).toBe(false);
    expect(result.current.isInvalid).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isValidating).toBe(false);
    expect(result.current.isTouched).toBe(false);
  });

  it('should validate a value', async () => {
    const { result } = renderHook(() => useValidator(mockValidValidator));

    await act(async () => {
      await result.current.validate('test');
    });

    expect(result.current.validation).toEqual({ isValid: true });
    expect(result.current.isValid).toBe(true);
    expect(result.current.isInvalid).toBe(false);
  });

  it('should show error for invalid value', async () => {
    const { result } = renderHook(() => useValidator(mockInvalidValidator));

    await act(async () => {
      await result.current.validate('test');
      result.current.setTouched(true);
    });

    expect(result.current.validation?.isValid).toBe(false);
    expect(result.current.isValid).toBe(false);
    expect(result.current.isInvalid).toBe(true);
    expect(result.current.error).toBe('Value is invalid');
  });

  it('should not show error when not touched and showErrorOnBlur is true', async () => {
    const { result } = renderHook(() => 
      useValidator(mockInvalidValidator, { showErrorOnBlur: true })
    );

    await act(async () => {
      await result.current.validate('test');
    });

    expect(result.current.isInvalid).toBe(true);
    expect(result.current.error).toBeNull(); // Not touched yet
  });

  it('should show error when touched', async () => {
    const { result } = renderHook(() => 
      useValidator(mockInvalidValidator, { showErrorOnBlur: true })
    );

    await act(async () => {
      await result.current.validate('test');
      result.current.setTouched(true);
    });

    expect(result.current.error).toBe('Value is invalid');
  });

  it('should reset validation state', async () => {
    const { result } = renderHook(() => useValidator(mockInvalidValidator));

    await act(async () => {
      await result.current.validate('test');
      result.current.setTouched(true);
    });

    expect(result.current.isInvalid).toBe(true);

    act(() => {
      result.current.reset();
    });

    expect(result.current.validation).toBeNull();
    expect(result.current.isTouched).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should validate on mount when validateOnMount is true', async () => {
    const validator = {
      ...mockValidValidator,
      validate: vi.fn().mockResolvedValue({ isValid: true }),
    };

    renderHook(() => useValidator(validator, { validateOnMount: true }));

    await waitFor(() => {
      expect(validator.validate).toHaveBeenCalled();
    });
  });

  it('should debounce validation', async () => {
    const validator = {
      ...mockValidValidator,
      validate: vi.fn().mockResolvedValue({ isValid: true }),
    };

    const { result } = renderHook(() => 
      useValidator(validator, { debounce: 100 })
    );

    act(() => {
      result.current.validate('test1');
      result.current.validate('test2');
      result.current.validate('test3');
    });

    // Should only call once after debounce
    await waitFor(() => {
      expect(validator.validate).toHaveBeenCalledTimes(1);
    }, { timeout: 200 });
  });

  it('should set isValidating during validation', async () => {
    let resolveValidation: (result: ValidationResult) => void;
    const slowValidator: Validator<string> = {
      ...mockValidValidator,
      validate: () => new Promise((resolve) => {
        resolveValidation = resolve;
      }),
    };

    const { result } = renderHook(() => useValidator(slowValidator));

    act(() => {
      result.current.validate('test');
    });

    expect(result.current.isValidating).toBe(true);

    await act(async () => {
      resolveValidation!({ isValid: true });
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.isValidating).toBe(false);
  });

  it('should handle touched state', () => {
    const { result } = renderHook(() => useValidator(mockValidValidator));

    expect(result.current.isTouched).toBe(false);

    act(() => {
      result.current.setTouched(true);
    });

    expect(result.current.isTouched).toBe(true);

    act(() => {
      result.current.setTouched(false);
    });

    expect(result.current.isTouched).toBe(false);
  });
});
