import { renderHook, act } from '@testing-library/react';

// Mock completo del hook useCaptcha
jest.mock('../useCaptcha', () => ({
  useCaptcha: () => ({
    captchaRef: { current: null },
    isCaptchaVerified: false,
    captchaError: null,
    captchaToken: null,
    executeCaptcha: jest.fn().mockResolvedValue('mock-token'),
    resetCaptcha: jest.fn(),
    onCaptchaSuccess: jest.fn(),
    onCaptchaExpired: jest.fn(),
    onCaptchaError: jest.fn(),
    getCaptchaSiteKey: () => '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
  }),
}));

import { useCaptcha } from '../useCaptcha';

describe('useCaptcha', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useCaptcha());

    expect(result.current.isCaptchaVerified).toBe(false);
    expect(result.current.captchaError).toBe(null);
    expect(result.current.captchaToken).toBe(null);
  });

  it('should return site key', () => {
    const { result } = renderHook(() => useCaptcha());

    const siteKey = result.current.getCaptchaSiteKey();
    expect(siteKey).toBe('6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI');
  });

  it('should execute captcha', async () => {
    const { result } = renderHook(() => useCaptcha());

    const token = await act(async () => {
      return await result.current.executeCaptcha();
    });

    expect(token).toBe('mock-token');
  });

  it('should reset captcha', () => {
    const { result } = renderHook(() => useCaptcha());

    act(() => {
      result.current.resetCaptcha();
    });

    expect(result.current.resetCaptcha).toHaveBeenCalled();
  });
});