// Polyfill for 'self' in Node.js environment
// This must be loaded before any other code via NODE_OPTIONS or --require

if (typeof self === 'undefined') {
  // Create a self object that proxies to globalThis
  // but maintains its own identity
  const selfProxy = new Proxy(globalThis, {
    get(target, prop) {
      return target[prop];
    },
    set(target, prop, value) {
      target[prop] = value;
      return true;
    }
  });

  global.self = selfProxy;
  globalThis.self = selfProxy;
}
