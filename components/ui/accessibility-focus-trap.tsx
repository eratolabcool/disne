'use client';

import * as React from 'react';

interface FocusTrapProps {
  children: React.ReactNode;
  enabled?: boolean;
  onEscapeKey?: () => void;
}

/**
 * FocusTrap 组件 - 符合 WCAG 2.1 AA 标准的焦点管理
 * 确保键盘用户只能在模态框内导航
 */
export function FocusTrap({ children, enabled = true, onEscapeKey }: FocusTrapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // 保存初始焦点
    const previousActiveElement = document.activeElement as HTMLElement;

    // 设置初始焦点
    firstElement?.focus();

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        // Shift + Tab: 向前导航
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab: 向后导航
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onEscapeKey) {
        onEscapeKey();
      }
    };

    // 添加事件监听器
    container.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscapeKey);

    // 防止背景滚动
    document.body.style.overflow = 'hidden';

    return () => {
      // 清理事件监听器
      container.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';

      // 恢复焦点
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    };
  }, [enabled, onEscapeKey]);

  return <div ref={containerRef}>{children}</div>;
}

/**
 * useFocusTrap Hook - 为模态框提供焦点陷阱功能
 */
export function useFocusTrap(enabled = true, onEscapeKey?: () => void) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!enabled || !ref.current) return;

    const container = ref.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    document.body.style.overflow = 'hidden';

    return () => {
      container.removeEventListener('keydown', handleTabKey);
      document.body.style.overflow = '';
    };
  }, [enabled, onEscapeKey]);

  return ref;
}