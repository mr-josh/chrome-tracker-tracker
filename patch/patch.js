// ==UserScript==
// @name         Chrome Tracker Tracker
// @namespace    http://github.com/mr-josh/chrome-tracker-tracker
// @version      2024-07-10
// @description  take a look at how sites use the chrome API
// @author       dotmrjosh
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

/**
 * Proxies an object to log how its being used
 * @param {any} target
 * @returns {any}
 */
const ProxyRecursively = (target) => {
  // If target is a false value (mainly undefined or null)
  if (!target) {
    return target;
  }
  console.log(
    `%cVALUE [${window.location.origin}]: ${JSON.stringify(target)}`,
    "background-color:#4f724f"
  );

  // If the target cant be proxied
  if (typeof target !== "object" && typeof target !== "function") {
    return target;
  }

  const proxy = new Proxy(target, {
    apply(target, thisArg, argArray) {
      console.log(
        `%cFUNCTION CALL [${window.location.origin}]: ${target
          .toString()
          .replace("()", `(${JSON.stringify(argArray)})`)}`,
        "background-color:#313251"
      );
      // @ts-ignore
      const result = Reflect.apply(...arguments);
      return ProxyRecursively(result);
    },
    construct(target, argArray, newTarget) {
      console.log(
        `%cCONSTRUCTING [${window.location.origin}]: ${target
          .toString()
          .replace("()", `(${JSON.stringify(argArray)})`)}`,
        "background-color:#374e5b"
      );
      // @ts-ignore
      const result = Reflect.construct(...arguments);
      return ProxyRecursively(result);
    },
    get(target, prop, receiver) {
      console.log(
        `%cACCESSING [${window.location.origin}]: ${JSON.stringify(prop)}`,
        "background-color:#53375b"
      );
      // @ts-ignore
      const result = Reflect.get(...arguments);
      return ProxyRecursively(result);
    },
  });

  return proxy;
};

// @ts-ignore
if (!window.dotsChromeTrackerRegistered) {
  // @ts-ignore
  const _originalChrome = window.chrome;
  // @ts-ignore
  window.chrome = ProxyRecursively(_originalChrome);
  // @ts-ignore
  window.dotsChromeTrackerRegistered = true;

  console.trace("Proxy registered in ", window.location.origin);
}
