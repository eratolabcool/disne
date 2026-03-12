// 高级性能监控和观察者

// Declare gtag as a global variable
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type LayoutShiftEntry = PerformanceEntry & { hadRecentInput?: boolean; value?: number };

export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initObservers();
  }

  private initObservers() {
    // 监控导航时间
    this.observeNavigation();
    // 监控资源加载
    this.observeResources();
    // 监控长任务
    this.observeLongTasks();
    // 监控内存使用
    this.observeMemory();
  }

  private observeNavigation() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const navEntry = entry as PerformanceNavigationTiming;
        this.recordMetric('domContentLoaded', navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart);
        this.recordMetric('pageLoad', navEntry.loadEventEnd - navEntry.loadEventStart);
        this.recordMetric('ttfb', navEntry.responseStart - navEntry.requestStart);
      }
    });
    observer.observe({ entryTypes: ['navigation'] });
    this.observers.push(observer);
  }

  private observeResources() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resourceEntry = entry as PerformanceResourceTiming;
        const category = this.getResourceCategory(resourceEntry.name);
        this.recordMetric(`${category}LoadTime`, resourceEntry.duration);
        this.recordMetric(`${category}Size`, resourceEntry.transferSize || 0);
      }
    });
    observer.observe({ entryTypes: ['resource'] });
    this.observers.push(observer);
  }

  private observeLongTasks() {
    if ('PerformanceObserver' in window && 'longtask' in PerformanceObserver.supportedEntryTypes) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('longTask', entry.duration);
        }
      });
      observer.observe({ entryTypes: ['longtask'] });
      this.observers.push(observer);
    }
  }

  private observeMemory() {
    if ('memory' in performance) {
      setInterval(() => {
        const mem = performance as Performance & {
          memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number };
        };
        if (!mem.memory) {
          return;
        }
        this.recordMetric('memoryUsage', mem.memory.usedJSHeapSize);
        this.recordMetric('memoryLimit', mem.memory.jsHeapSizeLimit);
      }, 5000);
    }
  }

  private getResourceCategory(url: string): string {
    if (url.includes('.js')) return 'script';
    if (url.includes('.css')) return 'stylesheet';
    if (url.includes('.png') || url.includes('.jpg') || url.includes('.webp')) return 'image';
    if (url.includes('.woff') || url.includes('.ttf')) return 'font';
    return 'other';
  }

  private recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  public getMetricsSummary() {
    const summary: Record<string, { avg: number; min: number; max: number; count: number }> = {};

    for (const [name, values] of this.metrics.entries()) {
      const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);

      summary[name] = {
        avg: Math.round(avg * 100) / 100,
        min: Math.round(min * 100) / 100,
        max: Math.round(max * 100) / 100,
        count: values.length
      };
    }

    return summary;
  }

  public getWebVitals() {
    const vitals = this.getMetricsSummary();
    return {
      LCP: this.getLargestContentfulPaint(),
      FID: this.getFirstInputDelay(),
      CLS: this.getCumulativeLayoutShift(),
      TTFB: vitals.ttfb?.avg || 0,
      pageLoad: vitals.pageLoad?.avg || 0
    };
  }

  private getLargestContentfulPaint(): number {
    const entries = performance.getEntriesByType('largest-contentful-paint');
    return entries.length > 0 ? entries[entries.length - 1].startTime : 0;
  }

  private getFirstInputDelay(): number {
    const entries = performance.getEntriesByType('first-input');
    if (entries.length === 0) {
      return 0;
    }
    const firstInputEntry = entries[0] as PerformanceEventTiming;
    return firstInputEntry.processingStart - firstInputEntry.startTime;
  }

  private getCumulativeLayoutShift(): number {
    let clsValue = 0;
    const entries = performance.getEntriesByType('layout-shift');
    for (const entry of entries) {
      const layoutShiftEntry = entry as LayoutShiftEntry;
      if (!layoutShiftEntry.hadRecentInput) {
        clsValue += layoutShiftEntry.value ?? 0;
      }
    }
    return clsValue;
  }

  public destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// 单例模式
export const performanceMonitor = new PerformanceMonitor();

// 导出工具函数
export const reportPerformance = () => {
  const metrics = performanceMonitor.getWebVitals();
  console.table(metrics);

  // 发送到分析服务
  if (typeof window.gtag !== 'undefined') {
    Object.entries(metrics).forEach(([name, value]) => {
      window.gtag?.('event', name, {
        event_category: 'Web Vitals',
        value: Math.round(value),
        non_interaction: true,
      });
    });
  }

  return metrics;
};
