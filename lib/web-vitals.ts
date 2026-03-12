// Web Vitals Performance Monitoring
export interface Metric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  entries: PerformanceEntry[];
}

// Core Web Vitals thresholds
const thresholds = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
};

// Helper function to get rating based on threshold
const getRating = (name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
  const threshold = thresholds[name as keyof typeof thresholds];
  if (!threshold) return 'good';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
};

// Report metric to console/analytics
const reportMetric = (metric: Metric) => {
  console.log(`[Web Vitals] ${metric.name}:`, {
    value: Math.round(metric.value * 100) / 100,
    rating: metric.rating,
    delta: metric.delta
  });

  // Send to analytics if in production
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.value),
      custom_map: {
        metric_rating: metric.rating,
        metric_delta: metric.delta
      }
    });
  }
};

// Observe Largest Contentful Paint (LCP)
export const observeLCP = () => {
  if (typeof window === 'undefined') return;

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];

    const metric: Metric = {
      id: 'lcp',
      name: 'LCP',
      value: lastEntry.startTime,
      rating: getRating('LCP', lastEntry.startTime),
      delta: 0,
      entries: [lastEntry]
    };

    reportMetric(metric);
  });

  observer.observe({ entryTypes: ['largest-contentful-paint'] });
};

// Observe Cumulative Layout Shift (CLS)
export const observeCLS = () => {
  if (typeof window === 'undefined') return;

  let clsValue = 0;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const layoutShiftEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
      if (!layoutShiftEntry.hadRecentInput) {
        clsValue += layoutShiftEntry.value ?? 0;
      }
    }

    const metric: Metric = {
      id: 'cls',
      name: 'CLS',
      value: clsValue,
      rating: getRating('CLS', clsValue),
      delta: 0,
      entries: list.getEntries()
    };

    reportMetric(metric);
  });

  observer.observe({ entryTypes: ['layout-shift'] });
};

// Observe First Input Delay (FID)
export const observeFID = () => {
  if (typeof window === 'undefined') return;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const eventTimingEntry = entry as PerformanceEventTiming;
      const fidValue = eventTimingEntry.processingStart - eventTimingEntry.startTime;
      const metric: Metric = {
        id: 'fid',
        name: 'FID',
        value: fidValue,
        rating: getRating('FID', fidValue),
        delta: fidValue,
        entries: [entry]
      };

      reportMetric(metric);
    }
  });

  observer.observe({ entryTypes: ['first-input'] });
};

// Initialize all Web Vitals monitoring
export const initWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Wait for page to load
  if (document.readyState === 'complete') {
    startMonitoring();
  } else {
    window.addEventListener('load', startMonitoring);
  }
};

const startMonitoring = () => {
  observeLCP();
  observeCLS();
  observeFID();
};

// Export for use in components
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
