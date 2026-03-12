'use client';

import { useEffect, useCallback, useRef } from 'react';

interface KeyboardNavigationOptions {
  enabled?: boolean;
  restoreFocus?: boolean;
  onEscape?: () => void;
}

/**
 * useKeyboardNavigation Hook - 提供完整的键盘导航功能
 * 符合 WCAG 2.1 AA 2.1.1 标准
 */
export function useKeyboardNavigation(options: KeyboardNavigationOptions = {}) {
  const {
    enabled = true,
    restoreFocus = true,
    onEscape
  } = options;

  const containerRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), details summary, [contenteditable="true"]'
    ) as NodeListOf<HTMLElement>;

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const currentElement = document.activeElement as HTMLElement;

    // Tab 键导航
    if (event.key === 'Tab') {
      let targetElement: HTMLElement | null = null;

      if (event.shiftKey) {
        // Shift + Tab: 向前导航
        if (currentElement === firstElement || !container.contains(currentElement)) {
          targetElement = lastElement;
        }
      } else {
        // Tab: 向后导航
        if (currentElement === lastElement || !container.contains(currentElement)) {
          targetElement = firstElement;
        }
      }

      if (targetElement) {
        event.preventDefault();
        targetElement.focus();
      }
    }

    // Enter 键处理
    if (event.key === 'Enter' && currentElement) {
      const isClickable = currentElement.tagName === 'BUTTON' ||
                           currentElement.tagName === 'A' ||
                           currentElement.role === 'button' ||
                           ('type' in currentElement && (currentElement.type === 'submit' || currentElement.type === 'button'));

      if (isClickable && !('disabled' in currentElement && currentElement.disabled)) {
        currentElement.click();
      }
    }

    // Escape 键处理
    if (event.key === 'Escape' && onEscape) {
      onEscape();
    }

    // 方向键导航
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      const currentIndex = Array.from(focusableElements).indexOf(currentElement);

      if (currentIndex !== -1) {
        let nextIndex = currentIndex;

        switch (event.key) {
          case 'ArrowUp':
            // 向上箭头：查找上方的元素
            nextIndex = Math.max(0, currentIndex - 1);
            break;
          case 'ArrowDown':
            // 向下箭头：查找下方的元素
            nextIndex = Math.min(focusableElements.length - 1, currentIndex + 1);
            break;
          case 'ArrowLeft':
            // 向左箭头：查找左边的元素
            nextIndex = Math.max(0, currentIndex - 1);
            break;
          case 'ArrowRight':
            // 向右箭头：查找右边的元素
            nextIndex = Math.min(focusableElements.length - 1, currentIndex + 1);
            break;
        }

        if (nextIndex !== currentIndex && nextIndex >= 0 && nextIndex < focusableElements.length) {
          event.preventDefault();
          focusableElements[nextIndex].focus();
        }
      }
    }

    // 数字键快速导航
    if (event.key >= '1' && event.key <= '9') {
      const index = parseInt(event.key) - 1;
      if (index < focusableElements.length) {
        event.preventDefault();
        focusableElements[index].focus();
      }
    }

    // Home 和 End 键
    if (event.key === 'Home') {
      event.preventDefault();
      firstElement.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      lastElement.focus();
    }
  }, [enabled, onEscape]);

  const activateKeyboardNavigation = useCallback(() => {
    if (!containerRef.current || !enabled) return;

    // 保存当前焦点
    previousFocusRef.current = document.activeElement as HTMLElement;

    // 焦点到第一个可聚焦元素
    const firstElement = containerRef.current.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;

    if (firstElement) {
      firstElement.focus();
    }

    // 添加键盘事件监听器
    document.addEventListener('keydown', handleKeyDown);

    // 设置容器为焦点捕获模式
    containerRef.current.setAttribute('tabindex', '0');
    containerRef.current.focus();
  }, [enabled, handleKeyDown]);

  const deactivateKeyboardNavigation = useCallback(() => {
    // 移除事件监听器
    document.removeEventListener('keydown', handleKeyDown);

    // 恢复原始焦点
    if (restoreFocus && previousFocusRef.current &&
        typeof previousFocusRef.current.focus === 'function') {
      previousFocusRef.current.focus();
    }

    // 清除焦点捕获
    if (containerRef.current) {
      containerRef.current.removeAttribute('tabindex');
    }
  }, [handleKeyDown, restoreFocus]);

  useEffect(() => {
    if (enabled) {
      activateKeyboardNavigation();
    }

    return () => {
      deactivateKeyboardNavigation();
    };
  }, [enabled, activateKeyboardNavigation, deactivateKeyboardNavigation]);

  return {
    containerRef,
    activateKeyboardNavigation,
    deactivateKeyboardNavigation
  };
}

/**
 * useFocusManagement Hook - 焦点管理工具
 */
export function useFocusManagement() {
  const focusRef = useRef<HTMLElement | null>(null);

  const focusElement = useCallback((element: HTMLElement | string | null) => {
    let targetElement: HTMLElement | null = null;

    if (typeof element === 'string') {
      targetElement = document.querySelector(element) as HTMLElement;
    } else if (element instanceof HTMLElement) {
      targetElement = element;
    }

    if (targetElement && typeof targetElement.focus === 'function') {
      targetElement.focus();
      focusRef.current = targetElement;
    }
  }, []);

  const blurElement = useCallback(() => {
    if (focusRef.current && typeof focusRef.current.blur === 'function') {
      focusRef.current.blur();
      focusRef.current = null;
    }
  }, []);

  const restoreFocus = useCallback(() => {
    if (focusRef.current) {
      focusRef.current.focus();
    }
  }, []);

  const getCurrentFocused = useCallback(() => {
    return focusRef.current;
  }, []);

  return {
    focusRef,
    focusElement,
    blurElement,
    restoreFocus,
    getCurrentFocused,
  };
}
