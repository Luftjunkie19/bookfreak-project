"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/use-clipboard-copy";
exports.ids = ["vendor-chunks/use-clipboard-copy"];
exports.modules = {

/***/ "(rsc)/./node_modules/use-clipboard-copy/dist/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/use-clipboard-copy/dist/index.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.useClipboard = void 0;\nvar clipboard_copy_1 = __importDefault(__webpack_require__(/*! clipboard-copy */ \"(rsc)/./node_modules/clipboard-copy/index.js\"));\nvar react_1 = __webpack_require__(/*! react */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-page/vendored/rsc/react.js\");\nvar useTimedToggle_1 = __webpack_require__(/*! ./useTimedToggle */ \"(rsc)/./node_modules/use-clipboard-copy/dist/useTimedToggle.js\");\nfunction isInputLike(node) {\n    return node && (node.nodeName === 'TEXTAREA' || node.nodeName === 'INPUT');\n}\nfunction useClipboard(options) {\n    if (options === void 0) { options = {}; }\n    var _a = useTimedToggle_1.useTimedToggle(false), copied = _a[0], toggleCopied = _a[1];\n    var targetRef = react_1.useRef(null);\n    var optionsRef = react_1.useRef(options);\n    optionsRef.current = options;\n    function isSupported() {\n        return (!!navigator.clipboard ||\n            (typeof document.execCommand === 'function' &&\n                typeof document.queryCommandSupported === 'function' &&\n                document.queryCommandSupported('copy')));\n    }\n    var copyHandler = react_1.useCallback(function (text) {\n        var opts = optionsRef.current;\n        var target = targetRef.current;\n        function handleSuccess() {\n            if (opts.onSuccess) {\n                opts.onSuccess();\n            }\n            if (opts.copiedTimeout) {\n                toggleCopied(opts.copiedTimeout);\n            }\n            if (opts.selectOnCopy && isInputLike(target)) {\n                target.select();\n            }\n        }\n        function handleError() {\n            if (opts.onError) {\n                opts.onError();\n            }\n            if (opts.selectOnError !== false && isInputLike(target)) {\n                target.select();\n            }\n        }\n        function copy(value) {\n            clipboard_copy_1.default(value).then(handleSuccess).catch(handleError);\n        }\n        if (typeof text === 'string') {\n            copy(text);\n        }\n        else if (target) {\n            copy(target.value);\n        }\n    }, []);\n    return {\n        copied: copied,\n        copy: copyHandler,\n        isSupported: isSupported,\n        target: targetRef,\n    };\n}\nexports.useClipboard = useClipboard;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvdXNlLWNsaXBib2FyZC1jb3B5L2Rpc3QvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQWE7QUFDYjtBQUNBLDZDQUE2QztBQUM3QztBQUNBLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxvQkFBb0I7QUFDcEIsdUNBQXVDLG1CQUFPLENBQUMsb0VBQWdCO0FBQy9ELGNBQWMsbUJBQU8sQ0FBQyx3R0FBTztBQUM3Qix1QkFBdUIsbUJBQU8sQ0FBQyx3RkFBa0I7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQiIsInNvdXJjZXMiOlsid2VicGFjazovL2Jvb2tmcmVhay1wcm9qZWN0Ly4vbm9kZV9tb2R1bGVzL3VzZS1jbGlwYm9hcmQtY29weS9kaXN0L2luZGV4LmpzPzIxMTYiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnVzZUNsaXBib2FyZCA9IHZvaWQgMDtcbnZhciBjbGlwYm9hcmRfY29weV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJjbGlwYm9hcmQtY29weVwiKSk7XG52YXIgcmVhY3RfMSA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbnZhciB1c2VUaW1lZFRvZ2dsZV8xID0gcmVxdWlyZShcIi4vdXNlVGltZWRUb2dnbGVcIik7XG5mdW5jdGlvbiBpc0lucHV0TGlrZShub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUgJiYgKG5vZGUubm9kZU5hbWUgPT09ICdURVhUQVJFQScgfHwgbm9kZS5ub2RlTmFtZSA9PT0gJ0lOUFVUJyk7XG59XG5mdW5jdGlvbiB1c2VDbGlwYm9hcmQob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHsgb3B0aW9ucyA9IHt9OyB9XG4gICAgdmFyIF9hID0gdXNlVGltZWRUb2dnbGVfMS51c2VUaW1lZFRvZ2dsZShmYWxzZSksIGNvcGllZCA9IF9hWzBdLCB0b2dnbGVDb3BpZWQgPSBfYVsxXTtcbiAgICB2YXIgdGFyZ2V0UmVmID0gcmVhY3RfMS51c2VSZWYobnVsbCk7XG4gICAgdmFyIG9wdGlvbnNSZWYgPSByZWFjdF8xLnVzZVJlZihvcHRpb25zKTtcbiAgICBvcHRpb25zUmVmLmN1cnJlbnQgPSBvcHRpb25zO1xuICAgIGZ1bmN0aW9uIGlzU3VwcG9ydGVkKCkge1xuICAgICAgICByZXR1cm4gKCEhbmF2aWdhdG9yLmNsaXBib2FyZCB8fFxuICAgICAgICAgICAgKHR5cGVvZiBkb2N1bWVudC5leGVjQ29tbWFuZCA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiBkb2N1bWVudC5xdWVyeUNvbW1hbmRTdXBwb3J0ZWQgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeUNvbW1hbmRTdXBwb3J0ZWQoJ2NvcHknKSkpO1xuICAgIH1cbiAgICB2YXIgY29weUhhbmRsZXIgPSByZWFjdF8xLnVzZUNhbGxiYWNrKGZ1bmN0aW9uICh0ZXh0KSB7XG4gICAgICAgIHZhciBvcHRzID0gb3B0aW9uc1JlZi5jdXJyZW50O1xuICAgICAgICB2YXIgdGFyZ2V0ID0gdGFyZ2V0UmVmLmN1cnJlbnQ7XG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVN1Y2Nlc3MoKSB7XG4gICAgICAgICAgICBpZiAob3B0cy5vblN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICBvcHRzLm9uU3VjY2VzcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdHMuY29waWVkVGltZW91dCkge1xuICAgICAgICAgICAgICAgIHRvZ2dsZUNvcGllZChvcHRzLmNvcGllZFRpbWVvdXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdHMuc2VsZWN0T25Db3B5ICYmIGlzSW5wdXRMaWtlKHRhcmdldCkpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXQuc2VsZWN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlRXJyb3IoKSB7XG4gICAgICAgICAgICBpZiAob3B0cy5vbkVycm9yKSB7XG4gICAgICAgICAgICAgICAgb3B0cy5vbkVycm9yKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0cy5zZWxlY3RPbkVycm9yICE9PSBmYWxzZSAmJiBpc0lucHV0TGlrZSh0YXJnZXQpKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LnNlbGVjdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNvcHkodmFsdWUpIHtcbiAgICAgICAgICAgIGNsaXBib2FyZF9jb3B5XzEuZGVmYXVsdCh2YWx1ZSkudGhlbihoYW5kbGVTdWNjZXNzKS5jYXRjaChoYW5kbGVFcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiB0ZXh0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgY29weSh0ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0YXJnZXQpIHtcbiAgICAgICAgICAgIGNvcHkodGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgfVxuICAgIH0sIFtdKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBjb3BpZWQ6IGNvcGllZCxcbiAgICAgICAgY29weTogY29weUhhbmRsZXIsXG4gICAgICAgIGlzU3VwcG9ydGVkOiBpc1N1cHBvcnRlZCxcbiAgICAgICAgdGFyZ2V0OiB0YXJnZXRSZWYsXG4gICAgfTtcbn1cbmV4cG9ydHMudXNlQ2xpcGJvYXJkID0gdXNlQ2xpcGJvYXJkO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/use-clipboard-copy/dist/index.js\n");

/***/ }),

/***/ "(rsc)/./node_modules/use-clipboard-copy/dist/useTimedToggle.js":
/*!****************************************************************!*\
  !*** ./node_modules/use-clipboard-copy/dist/useTimedToggle.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.useTimedToggle = void 0;\nvar react_1 = __webpack_require__(/*! react */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-page/vendored/rsc/react.js\");\nfunction useTimedToggle(initialValue) {\n    var _a = react_1.useState(false), value = _a[0], setValue = _a[1];\n    var timeoutRef = react_1.useRef();\n    var initialValueRef = react_1.useRef(initialValue);\n    var toggleValue = function (timeout) {\n        clearTimeout(timeoutRef.current);\n        setValue(!initialValueRef.current);\n        timeoutRef.current = window.setTimeout(function () { return setValue(initialValueRef.current); }, timeout);\n    };\n    react_1.useEffect(function () { return function () { return clearTimeout(timeoutRef.current); }; }, []);\n    return [value, toggleValue];\n}\nexports.useTimedToggle = useTimedToggle;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvdXNlLWNsaXBib2FyZC1jb3B5L2Rpc3QvdXNlVGltZWRUb2dnbGUuanMiLCJtYXBwaW5ncyI6IkFBQWE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Qsc0JBQXNCO0FBQ3RCLGNBQWMsbUJBQU8sQ0FBQyx3R0FBTztBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZEQUE2RCwyQ0FBMkM7QUFDeEc7QUFDQSxvQ0FBb0MscUJBQXFCLDZDQUE2QztBQUN0RztBQUNBO0FBQ0Esc0JBQXNCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYm9va2ZyZWFrLXByb2plY3QvLi9ub2RlX21vZHVsZXMvdXNlLWNsaXBib2FyZC1jb3B5L2Rpc3QvdXNlVGltZWRUb2dnbGUuanM/MDE5NyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudXNlVGltZWRUb2dnbGUgPSB2b2lkIDA7XG52YXIgcmVhY3RfMSA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmZ1bmN0aW9uIHVzZVRpbWVkVG9nZ2xlKGluaXRpYWxWYWx1ZSkge1xuICAgIHZhciBfYSA9IHJlYWN0XzEudXNlU3RhdGUoZmFsc2UpLCB2YWx1ZSA9IF9hWzBdLCBzZXRWYWx1ZSA9IF9hWzFdO1xuICAgIHZhciB0aW1lb3V0UmVmID0gcmVhY3RfMS51c2VSZWYoKTtcbiAgICB2YXIgaW5pdGlhbFZhbHVlUmVmID0gcmVhY3RfMS51c2VSZWYoaW5pdGlhbFZhbHVlKTtcbiAgICB2YXIgdG9nZ2xlVmFsdWUgPSBmdW5jdGlvbiAodGltZW91dCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dFJlZi5jdXJyZW50KTtcbiAgICAgICAgc2V0VmFsdWUoIWluaXRpYWxWYWx1ZVJlZi5jdXJyZW50KTtcbiAgICAgICAgdGltZW91dFJlZi5jdXJyZW50ID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyByZXR1cm4gc2V0VmFsdWUoaW5pdGlhbFZhbHVlUmVmLmN1cnJlbnQpOyB9LCB0aW1lb3V0KTtcbiAgICB9O1xuICAgIHJlYWN0XzEudXNlRWZmZWN0KGZ1bmN0aW9uICgpIHsgcmV0dXJuIGZ1bmN0aW9uICgpIHsgcmV0dXJuIGNsZWFyVGltZW91dCh0aW1lb3V0UmVmLmN1cnJlbnQpOyB9OyB9LCBbXSk7XG4gICAgcmV0dXJuIFt2YWx1ZSwgdG9nZ2xlVmFsdWVdO1xufVxuZXhwb3J0cy51c2VUaW1lZFRvZ2dsZSA9IHVzZVRpbWVkVG9nZ2xlO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/use-clipboard-copy/dist/useTimedToggle.js\n");

/***/ })

};
;