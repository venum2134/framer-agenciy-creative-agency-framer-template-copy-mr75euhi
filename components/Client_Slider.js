// http-url:https://framerusercontent.com/modules/h0JQ0X944aCdOTBiZT00/2PC43OIRrfoxXvLymNPl/p3U76aBhW.js
import { jsx as _jsx3 } from "react/jsx-runtime";
import { addFonts as addFonts2, ComponentViewportProvider, cx as cx2, getFonts, SmartComponentScopedContainer, useComponentViewport as useComponentViewport2, useLocaleInfo as useLocaleInfo2, useVariantState as useVariantState2, withCSS as withCSS2 } from "framer";
import { LayoutGroup as LayoutGroup3, motion as motion3, MotionConfigContext as MotionConfigContext2 } from "framer-motion";
import * as React2 from "react";
import { useRef as useRef3 } from "react";

// http-url:https://framerusercontent.com/modules/B2xAlJLcN0gOnt11mSPw/plhC5PVnCMllW5QXjFK5/Ticker.js
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Children, useLayoutEffect, useEffect, useState, useRef, useMemo, useCallback, cloneElement, startTransition, forwardRef, useImperativeHandle } from "react";
import { addPropertyControls, ControlType, RenderTarget } from "framer";
import { useReducedMotion, LayoutGroup, useInView, useMotionValue, useTransform, motion, frame } from "framer-motion";
import { resize } from "@motionone/dom";
var MAX_DUPLICATED_ITEMS = 100;
var directionTransformers = { left: (offset) => `translateX(-${offset}px)`, right: (offset) => `translateX(${offset}px)`, top: (offset) => `translateY(-${offset}px)`, bottom: (offset) => `translateY(${offset}px)` };
function Ticker(props) {
  let { slots = [], gap, padding, paddingPerSide, paddingTop, paddingRight, paddingBottom, paddingLeft, speed, hoverFactor, direction, alignment, sizingOptions, fadeOptions, style } = props;
  const { fadeContent, overflow, fadeWidth, fadeInset, fadeAlpha } = fadeOptions;
  const { widthType, heightType } = sizingOptions;
  const paddingValue = paddingPerSide ? `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px` : `${padding}px`;
  const currentTarget = RenderTarget.current();
  const isCanvas = currentTarget === RenderTarget.canvas || currentTarget === RenderTarget.export;
  const writingDirection = useWritingDirection();
  const filteredSlots = slots.filter(Boolean);
  const numChildren = Children.count(filteredSlots);
  const hasChildren = numChildren > 0;
  const offset = useMotionValue(0);
  const resolvedDirection = getTickerResolvedDirection(direction === true ? "left" : direction, writingDirection);
  const isHorizontal = resolvedDirection === "left" || resolvedDirection === "right";
  const transformer = directionTransformers[resolvedDirection];
  const transform = useTransform(offset, transformer);
  const parentRef = useRef(null);
  const childrenRef = useMemo(() => {
    return [{ current: null }, { current: null }];
  }, []);
  const [size, setSize] = useState({ parent: null, children: null });
  let clonedChildren = null;
  let dupedChildren = [];
  let duplicateBy = 0;
  let opacity = 0;
  if (isCanvas) {
    duplicateBy = numChildren ? Math.floor(10 / numChildren) : 0;
    opacity = 1;
  }
  if (!isCanvas && hasChildren && size.parent) {
    duplicateBy = Math.round(size.parent / size.children * 2) + 1;
    duplicateBy = Math.min(duplicateBy, MAX_DUPLICATED_ITEMS);
    opacity = 1;
  }
  const measure = useCallback(() => {
    if (hasChildren && parentRef.current) {
      const parentLength = isHorizontal ? parentRef.current.offsetWidth : parentRef.current.offsetHeight;
      const start = childrenRef[0].current ? isHorizontal ? childrenRef[0].current.offsetLeft : childrenRef[0].current.offsetTop : 0;
      const end = childrenRef[1].current ? isHorizontal ? childrenRef[1].current.offsetLeft + childrenRef[1].current.offsetWidth : childrenRef[1].current.offsetTop + childrenRef[1].current.offsetHeight : 0;
      const childrenLength = end - start + gap;
      startTransition(() => {
        setSize({ parent: parentLength, children: childrenLength });
      });
    }
  }, []);
  const childrenStyles = isCanvas ? { contentVisibility: "auto" } : {};
  if (hasChildren) {
    if (!isCanvas) {
      let initialResize = useRef(true);
      useLayoutEffect(() => {
        frame.read(measure, false, true);
        return resize(parentRef.current, ({ contentSize }) => {
          if (!initialResize.current && (contentSize.width || contentSize.height)) {
            frame.read(measure, false, true);
          }
          initialResize.current = false;
        });
      }, []);
    }
    clonedChildren = Children.map(filteredSlots, (child, index) => {
      let ref;
      if (index === 0) {
        ref = childrenRef[writingDirection === "rtl" && isHorizontal ? 1 : 0];
      }
      if (index === filteredSlots.length - 1) {
        ref = childrenRef[writingDirection === "rtl" && isHorizontal ? 0 : 1];
      }
      const size2 = { width: widthType ? child.props?.width : "100%", height: heightType ? child.props?.height : "100%" };
      return /* @__PURE__ */ _jsx(LayoutGroup, { inherit: "id", children: /* @__PURE__ */ _jsx(Wrapper, { ref, style: size2, children: /* @__PURE__ */ cloneElement(child, { style: { ...child.props?.style, ...size2, flexShrink: 0, ...childrenStyles }, layoutId: child.props.layoutId ? child.props.layoutId + "-original-" + index : void 0 }, child.props?.children) }) });
    });
  }
  const isInView = isCanvas ? true : useInView(parentRef);
  if (!isCanvas) {
    for (let i = 0; i < duplicateBy; i++) {
      dupedChildren = dupedChildren.concat(Children.map(filteredSlots, (child, childIndex) => {
        const size2 = { width: widthType ? child.props?.width : "100%", height: heightType ? child.props?.height : "100%", willChange: !isInView ? void 0 : "transform" };
        return /* @__PURE__ */ _jsx(LayoutGroup, { inherit: "id", children: /* @__PURE__ */ _jsx(Wrapper, { style: size2, children: /* @__PURE__ */ cloneElement(child, { key: i + " " + childIndex, style: { ...child.props?.style, width: widthType ? child.props?.width : "100%", height: heightType ? child.props?.height : "100%", flexShrink: 0, ...childrenStyles }, layoutId: child.props.layoutId ? child.props.layoutId + "-dupe-" + i : void 0 }, child.props?.children) }, i + "li" + childIndex) }, i + "lg" + childIndex);
      }));
    }
  }
  const animateToValue = size.children + size.children * Math.round(size.parent / size.children);
  const initialTime = useRef(null);
  const prevTime = useRef(null);
  const xOrY = useRef(0);
  const isHover = useRef(false);
  const isReducedMotion = useReducedMotion();
  const listRef = useRef(null);
  const animationRef = useRef(null);
  if (!isCanvas) {
    useEffect(() => {
      if (isReducedMotion || !animateToValue || !speed) {
        return;
      }
      animationRef.current = listRef.current.animate({ transform: [transformer(0), transformer(animateToValue)] }, { duration: Math.abs(animateToValue) / speed * 1e3, iterations: Infinity, iterationStart: writingDirection === "rtl" ? 1 : 0, easing: "linear" });
      return () => animationRef.current.cancel();
    }, [hoverFactor, animateToValue, speed, writingDirection]);
    const playOrPause = useCallback(() => {
      if (!animationRef.current) return;
      const hidden = document.hidden;
      if (isInView && !hidden && animationRef.current.playState === "paused") {
        animationRef.current.play();
      } else if ((!isInView || hidden) && animationRef.current.playState === "running") {
        animationRef.current.pause();
      }
    }, [isInView]);
    useEffect(() => {
      playOrPause();
    }, [isInView, hoverFactor, animateToValue, speed]);
    useEffect(() => {
      document.addEventListener("visibilitychange", playOrPause);
      return () => {
        document.removeEventListener("visibilitychange", playOrPause);
      };
    }, [playOrPause]);
  }
  const fadeDirection = isHorizontal ? "to right" : "to bottom";
  const fadeWidthStart = fadeWidth / 2;
  const fadeWidthEnd = 100 - fadeWidth / 2;
  const fadeInsetStart = clamp(fadeInset, 0, fadeWidthStart);
  const fadeInsetEnd = 100 - fadeInset;
  const fadeMask = `linear-gradient(${fadeDirection}, rgba(0, 0, 0, ${fadeAlpha}) ${fadeInsetStart}%, rgba(0, 0, 0, 1) ${fadeWidthStart}%, rgba(0, 0, 0, 1) ${fadeWidthEnd}%, rgba(0, 0, 0, ${fadeAlpha}) ${fadeInsetEnd}%)`;
  if (!hasChildren) {
    return /* @__PURE__ */ _jsxs("section", { style: placeholderStyles, children: [/* @__PURE__ */ _jsx("div", { style: emojiStyles, children: "\u2728" }), /* @__PURE__ */ _jsx("p", { style: titleStyles, children: "Connect to Content" }), /* @__PURE__ */ _jsx("p", { style: subtitleStyles, children: "Add layers or components to infinitely loop on your page." })] });
  }
  return /* @__PURE__ */ _jsx("section", { style: { ...containerStyle, opacity, WebkitMaskImage: fadeContent ? fadeMask : void 0, maskImage: fadeContent ? fadeMask : void 0, overflow: overflow ? "visible" : "hidden", padding: paddingValue }, ref: parentRef, children: /* @__PURE__ */ _jsxs(motion.ul, { ref: listRef, style: { ...containerStyle, gap, top: direction === "bottom" && isValidNumber(animateToValue) ? -animateToValue : void 0, left: direction === "right" && isValidNumber(animateToValue) ? animateToValue * (writingDirection === "rtl" ? 1 : -1) : void 0, placeItems: alignment, position: "relative", flexDirection: isHorizontal ? "row" : "column", ...style, willChange: isCanvas || !isInView ? "auto" : "transform", transform: transformer(0) }, onMouseEnter: () => {
    isHover.current = true;
    if (animationRef.current) {
      animationRef.current.playbackRate = hoverFactor;
    }
  }, onMouseLeave: () => {
    isHover.current = false;
    if (animationRef.current) {
      animationRef.current.playbackRate = 1;
    }
  }, children: [clonedChildren, dupedChildren] }) });
}
var Wrapper = /* @__PURE__ */ forwardRef(({ children, ...props }, ref) => {
  const innerRef = useRef();
  const inView = useInView(innerRef);
  useImperativeHandle(ref, () => innerRef.current);
  useEffect(() => {
    const current = innerRef.current;
    if (!current) return;
    if (inView) {
      current.querySelectorAll("button,a").forEach((el) => {
        const orig = el.dataset.origTabIndex;
        if (orig) el.tabIndex = orig;
        else el.removeAttribute("tabIndex");
      });
    } else {
      current.querySelectorAll("button,a").forEach((el) => {
        const orig = el.getAttribute("tabIndex");
        if (orig) el.dataset.origTabIndex = orig;
        el.tabIndex = -1;
      });
    }
  }, [inView]);
  return /* @__PURE__ */ _jsx("li", { ...props, "aria-hidden": !inView, ref: innerRef, children });
});
Ticker.defaultProps = { gap: 10, padding: 10, sizingOptions: { widthType: true, heightType: true }, fadeOptions: { fadeContent: true, overflow: false, fadeWidth: 25, fadeAlpha: 0, fadeInset: 0 }, direction: true };
addPropertyControls(Ticker, { slots: { type: ControlType.Array, title: "Children", control: { type: ControlType.ComponentInstance } }, speed: { type: ControlType.Number, title: "Speed", min: 0, max: 1e3, defaultValue: 100, unit: "%", displayStepper: true, step: 5 }, direction: { type: ControlType.Enum, title: "Direction", options: ["left", "right", "top", "bottom"], optionIcons: ["direction-left", "direction-right", "direction-up", "direction-down"], optionTitles: ["Left", "Right", "Top", "Bottom"], defaultValue: "left", displaySegmentedControl: true }, alignment: { type: ControlType.Enum, title: "Align", options: ["flex-start", "center", "flex-end"], optionIcons: { direction: { right: ["align-top", "align-middle", "align-bottom"], left: ["align-top", "align-middle", "align-bottom"], top: ["align-left", "align-center", "align-right"], bottom: ["align-left", "align-center", "align-right"] } }, defaultValue: "center", displaySegmentedControl: true }, gap: { type: ControlType.Number, title: "Gap" }, padding: { title: "Padding", type: ControlType.FusedNumber, toggleKey: "paddingPerSide", toggleTitles: ["Padding", "Padding per side"], valueKeys: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"], valueLabels: ["T", "R", "B", "L"], min: 0 }, sizingOptions: { type: ControlType.Object, title: "Sizing", controls: { widthType: { type: ControlType.Boolean, title: "Width", enabledTitle: "Auto", disabledTitle: "Stretch", defaultValue: true }, heightType: { type: ControlType.Boolean, title: "Height", enabledTitle: "Auto", disabledTitle: "Stretch", defaultValue: true } } }, fadeOptions: { type: ControlType.Object, title: "Clipping", controls: { fadeContent: { type: ControlType.Boolean, title: "Fade", defaultValue: true }, overflow: { type: ControlType.Boolean, title: "Overflow", enabledTitle: "Show", disabledTitle: "Hide", defaultValue: false, hidden(props) {
  return props.fadeContent === true;
} }, fadeWidth: { type: ControlType.Number, title: "Width", defaultValue: 25, min: 0, max: 100, unit: "%", hidden(props) {
  return props.fadeContent === false;
} }, fadeInset: { type: ControlType.Number, title: "Inset", defaultValue: 0, min: 0, max: 100, unit: "%", hidden(props) {
  return props.fadeContent === false;
} }, fadeAlpha: { type: ControlType.Number, title: "Opacity", defaultValue: 0, min: 0, max: 1, step: 0.05, hidden(props) {
  return props.fadeContent === false;
} } } }, hoverFactor: { type: ControlType.Number, title: "Hover", min: 0, max: 1, unit: "x", defaultValue: 1, step: 0.1, displayStepper: true, description: "Slows down the speed while you are hovering." } });
var containerStyle = { display: "flex", width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%", placeItems: "center", margin: 0, padding: 0, listStyleType: "none", textIndent: "none" };
var placeholderStyles = { display: "flex", width: "100%", height: "100%", placeContent: "center", placeItems: "center", flexDirection: "column", color: "#96F", background: "rgba(136, 85, 255, 0.1)", fontSize: 11, overflow: "hidden", padding: "20px 20px 30px 20px" };
var emojiStyles = { fontSize: 32, marginBottom: 10 };
var titleStyles = { margin: 0, marginBottom: 10, fontWeight: 600, textAlign: "center" };
var subtitleStyles = { margin: 0, opacity: 0.7, maxWidth: 150, lineHeight: 1.5, textAlign: "center" };
var clamp = (num, min, max) => Math.min(Math.max(num, min), max);
var isValidNumber = (value) => typeof value === "number" && !isNaN(value);
function useWritingDirection() {
  if (!window || !window.document || !window.document.documentElement) return "ltr";
  return window.document.documentElement.dir === "rtl" ? "rtl" : "ltr";
}
function getTickerResolvedDirection(direction, writingDirection) {
  if (writingDirection !== "rtl") return direction;
  if (direction === "left") return "right";
  if (direction === "right") return "left";
  return direction;
}

// http-url:https://framerusercontent.com/modules/aK5WA6twKcb3iI6LgHyb/DFsN8tHTXEQ8NKwWl0fN/Gi2E9oIdk.js
import { jsx as _jsx2 } from "react/jsx-runtime";
import { addFonts, addPropertyControls as addPropertyControls2, ControlType as ControlType2, cx, getLoadingLazyAtYPosition, Image, useComponentViewport, useLocaleInfo, useVariantState, withCSS } from "framer";
import { LayoutGroup as LayoutGroup2, motion as motion2, MotionConfigContext } from "framer-motion";
import * as React from "react";
import { useRef as useRef2 } from "react";
var serializationHash = "framer-a8WLp";
var variantClassNames = { hilwQpJ9G: "framer-v-1rrij40" };
var transition1 = { bounce: 0.2, delay: 0, duration: 0.4, type: "spring" };
var toResponsiveImage = (value) => {
  if (typeof value === "object" && value !== null && typeof value.src === "string") {
    return value;
  }
  return typeof value === "string" ? { src: value } : void 0;
};
var Transition = ({ value, children }) => {
  const config = React.useContext(MotionConfigContext);
  const transition = value ?? config.transition;
  const contextValue = React.useMemo(() => ({ ...config, transition }), [JSON.stringify(transition)]);
  return /* @__PURE__ */ _jsx2(MotionConfigContext.Provider, { value: contextValue, children });
};
var Variants = motion2.create(React.Fragment);
var getProps = ({ height, id, image, width, ...props }) => {
  return { ...props, XSz1rOWkL: image ?? props.XSz1rOWkL ?? { alt: "ticker image", pixelHeight: 20, pixelWidth: 89, src: "https://framerusercontent.com/images/Os7ysPpNF81KXSwoiKe05fqaug.svg?width=89&height=20" } };
};
var createLayoutDependency = (props, variants) => {
  if (props.layoutDependency) return variants.join("-") + props.layoutDependency;
  return variants.join("-");
};
var Component = /* @__PURE__ */ React.forwardRef(function(props, ref) {
  const fallbackRef = useRef2(null);
  const refBinding = ref ?? fallbackRef;
  const defaultLayoutId = React.useId();
  const { activeLocale, setLocale } = useLocaleInfo();
  const componentViewport = useComponentViewport();
  const { style, className, layoutId, variant, XSz1rOWkL, ...restProps } = getProps(props);
  const { baseVariant, classNames, clearLoadingGesture, gestureHandlers, gestureVariant, isLoading, setGestureState, setVariant, variants } = useVariantState({ defaultVariant: "hilwQpJ9G", ref: refBinding, variant, variantClassNames });
  const layoutDependency = createLayoutDependency(props, variants);
  const sharedStyleClassNames = [];
  const scopingClassNames = cx(serializationHash, ...sharedStyleClassNames);
  return /* @__PURE__ */ _jsx2(LayoutGroup2, { id: layoutId ?? defaultLayoutId, children: /* @__PURE__ */ _jsx2(Variants, { animate: variants, initial: false, children: /* @__PURE__ */ _jsx2(Transition, { value: transition1, children: /* @__PURE__ */ _jsx2(motion2.div, { ...restProps, ...gestureHandlers, className: cx(scopingClassNames, "framer-1rrij40", className, classNames), "data-framer-name": "Primary", layoutDependency, layoutId: "hilwQpJ9G", ref: refBinding, style: { ...style }, children: /* @__PURE__ */ _jsx2(Image, { background: { alt: "ticker image", fit: "fit", loading: getLoadingLazyAtYPosition((componentViewport?.y || 0) + 0 + (((componentViewport?.height || 20) - 0 - (Math.max(0, ((componentViewport?.height || 20) - 0 - 0) / 1) * 1 + 0)) / 2 + 0 + 0)), pixelHeight: 21, pixelWidth: 93, sizes: componentViewport?.width || "100vw", ...toResponsiveImage(XSz1rOWkL), ...{ positionX: "center", positionY: "center" } }, className: "framer-51clg3", layoutDependency, layoutId: "geqqFOxSn" }) }) }) }) });
});
var css = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-a8WLp.framer-xmpcfh, .framer-a8WLp .framer-xmpcfh { display: block; }", ".framer-a8WLp.framer-1rrij40 { align-content: center; align-items: center; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: 20px; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 89px; }", ".framer-a8WLp .framer-51clg3 { flex: 1 0 0px; height: 1px; overflow: hidden; position: relative; width: 100%; }"];
var FramerGi2E9oIdk = withCSS(Component, css, "framer-a8WLp");
var Gi2E9oIdk_default = FramerGi2E9oIdk;
FramerGi2E9oIdk.displayName = "Client Image";
FramerGi2E9oIdk.defaultProps = { height: 20, width: 89 };
addPropertyControls2(FramerGi2E9oIdk, { XSz1rOWkL: { __defaultAssetReference: "data:framer/asset-reference,Os7ysPpNF81KXSwoiKe05fqaug.svg?originalFilename=tick5.svg&preferredSize=auto", __vekterDefault: { alt: "ticker image", assetReference: "data:framer/asset-reference,Os7ysPpNF81KXSwoiKe05fqaug.svg?originalFilename=tick5.svg&preferredSize=auto" }, title: "Image", type: ControlType2.ResponsiveImage } });
addFonts(FramerGi2E9oIdk, [{ explicitInter: true, fonts: [] }], { supportsExplicitInterCodegen: true });

// http-url:https://framerusercontent.com/modules/h0JQ0X944aCdOTBiZT00/2PC43OIRrfoxXvLymNPl/p3U76aBhW.js
var ClientImageFonts = getFonts(Gi2E9oIdk_default);
var TickerFonts = getFonts(Ticker);
var serializationHash2 = "framer-ENelr";
var variantClassNames2 = { KiFMTCLsX: "framer-v-9cdlnw" };
var transition12 = { bounce: 0.2, delay: 0, duration: 0.4, type: "spring" };
var addImageAlt = (image, alt) => {
  if (!image || typeof image !== "object") {
    return;
  }
  return { ...image, alt };
};
var Transition2 = ({ value, children }) => {
  const config = React2.useContext(MotionConfigContext2);
  const transition = value ?? config.transition;
  const contextValue = React2.useMemo(() => ({ ...config, transition }), [JSON.stringify(transition)]);
  return /* @__PURE__ */ _jsx3(MotionConfigContext2.Provider, { value: contextValue, children });
};
var Variants2 = motion3.create(React2.Fragment);
var getProps2 = ({ height, id, width, ...props }) => {
  return { ...props };
};
var createLayoutDependency2 = (props, variants) => {
  if (props.layoutDependency) return variants.join("-") + props.layoutDependency;
  return variants.join("-");
};
var Component2 = /* @__PURE__ */ React2.forwardRef(function(props, ref) {
  const fallbackRef = useRef3(null);
  const refBinding = ref ?? fallbackRef;
  const defaultLayoutId = React2.useId();
  const { activeLocale, setLocale } = useLocaleInfo2();
  const componentViewport = useComponentViewport2();
  const { style, className, layoutId, variant, ...restProps } = getProps2(props);
  const { baseVariant, classNames, clearLoadingGesture, gestureHandlers, gestureVariant, isLoading, setGestureState, setVariant, variants } = useVariantState2({ defaultVariant: "KiFMTCLsX", ref: refBinding, variant, variantClassNames: variantClassNames2 });
  const layoutDependency = createLayoutDependency2(props, variants);
  const sharedStyleClassNames = [];
  const scopingClassNames = cx2(serializationHash2, ...sharedStyleClassNames);
  return /* @__PURE__ */ _jsx3(LayoutGroup3, { id: layoutId ?? defaultLayoutId, children: /* @__PURE__ */ _jsx3(Variants2, { animate: variants, initial: false, children: /* @__PURE__ */ _jsx3(Transition2, { value: transition12, children: /* @__PURE__ */ _jsx3(motion3.div, { ...restProps, ...gestureHandlers, className: cx2(scopingClassNames, "framer-9cdlnw", className, classNames), "data-framer-name": "Primary", layoutDependency, layoutId: "KiFMTCLsX", ref: refBinding, style: { ...style }, children: /* @__PURE__ */ _jsx3(ComponentViewportProvider, { children: /* @__PURE__ */ _jsx3(SmartComponentScopedContainer, { className: "framer-t0r14x-container", isAuthoredByUser: true, isModuleExternal: true, layoutDependency, layoutId: "xmMLQGf9l-container", nodeId: "xmMLQGf9l", rendersWithMotion: true, scopeId: "p3U76aBhW", children: /* @__PURE__ */ _jsx3(Ticker, { alignment: "center", direction: "left", fadeOptions: { fadeAlpha: 0, fadeContent: true, fadeInset: 0, fadeWidth: 25, overflow: false }, gap: 32, height: "100%", hoverFactor: 1, id: "xmMLQGf9l", layoutId: "xmMLQGf9l", padding: 0, paddingBottom: 0, paddingLeft: 0, paddingPerSide: false, paddingRight: 0, paddingTop: 0, sizingOptions: { heightType: true, widthType: true }, slots: [/* @__PURE__ */ _jsx3(ComponentViewportProvider, { height: 20, width: "89px", children: /* @__PURE__ */ _jsx3(SmartComponentScopedContainer, { className: "framer-15vtfmz-container", "data-framer-name": "Client Image1", inComponentSlot: true, layoutDependency, layoutId: "Gf116aEwB-wTk4sI0jB-0-container", name: "Client Image1", nodeId: "wTk4sI0jB", rendersWithMotion: true, scopeId: "p3U76aBhW", children: /* @__PURE__ */ _jsx3(Gi2E9oIdk_default, { height: "100%", id: "wTk4sI0jB", layoutId: "Gf116aEwB-wTk4sI0jB-0", name: "Client Image1", style: { width: "100%" }, width: "100%" }) }) }), /* @__PURE__ */ _jsx3(ComponentViewportProvider, { height: 20, width: "54px", children: /* @__PURE__ */ _jsx3(SmartComponentScopedContainer, { className: "framer-1h8h7s-container", "data-framer-name": "Client Image2", inComponentSlot: true, layoutDependency, layoutId: "uZ4emotmB-x_CblIo4U-1-container", name: "Client Image2", nodeId: "x_CblIo4U", rendersWithMotion: true, scopeId: "p3U76aBhW", children: /* @__PURE__ */ _jsx3(Gi2E9oIdk_default, { height: "100%", id: "x_CblIo4U", layoutId: "uZ4emotmB-x_CblIo4U-1", name: "Client Image2", style: { width: "100%" }, width: "100%", XSz1rOWkL: addImageAlt({ pixelHeight: 20, pixelWidth: 54, src: "https://framerusercontent.com/images/IiHC7c0IrE5gCeVJ5uuD6MpFB4o.svg?width=54&height=20" }, "ticker image") }) }) }), /* @__PURE__ */ _jsx3(ComponentViewportProvider, { height: 20, width: "63px", children: /* @__PURE__ */ _jsx3(SmartComponentScopedContainer, { className: "framer-1uhfsel-container", "data-framer-name": "Client Image3", inComponentSlot: true, layoutDependency, layoutId: "iYRISvw_2-HEP6OeXTu-2-container", name: "Client Image3", nodeId: "HEP6OeXTu", rendersWithMotion: true, scopeId: "p3U76aBhW", children: /* @__PURE__ */ _jsx3(Gi2E9oIdk_default, { height: "100%", id: "HEP6OeXTu", layoutId: "iYRISvw_2-HEP6OeXTu-2", name: "Client Image3", style: { width: "100%" }, width: "100%", XSz1rOWkL: addImageAlt({ pixelHeight: 20, pixelWidth: 63, src: "https://framerusercontent.com/images/xQD7ksKN1zo25trsYz1zfhQF3s.svg?width=63&height=20" }, "ticker image") }) }) }), /* @__PURE__ */ _jsx3(ComponentViewportProvider, { height: 20, width: "81px", children: /* @__PURE__ */ _jsx3(SmartComponentScopedContainer, { className: "framer-12ynqb-container", "data-framer-name": "Client Image4", inComponentSlot: true, layoutDependency, layoutId: "qDzYcOYHE-ap2JDt6hH-3-container", name: "Client Image4", nodeId: "ap2JDt6hH", rendersWithMotion: true, scopeId: "p3U76aBhW", children: /* @__PURE__ */ _jsx3(Gi2E9oIdk_default, { height: "100%", id: "ap2JDt6hH", layoutId: "qDzYcOYHE-ap2JDt6hH-3", name: "Client Image4", style: { width: "100%" }, width: "100%", XSz1rOWkL: addImageAlt({ pixelHeight: 21, pixelWidth: 82, src: "https://framerusercontent.com/images/PwEx7CMnmSjZlq05ledcnMg0nA.svg?width=82&height=21" }, "ticker image") }) }) }), /* @__PURE__ */ _jsx3(ComponentViewportProvider, { height: 20, width: "92px", children: /* @__PURE__ */ _jsx3(SmartComponentScopedContainer, { className: "framer-azbxvk-container", "data-framer-name": "Client Image5", inComponentSlot: true, layoutDependency, layoutId: "OJPhsEYYD-TfA9XJ6qG-4-container", name: "Client Image5", nodeId: "TfA9XJ6qG", rendersWithMotion: true, scopeId: "p3U76aBhW", children: /* @__PURE__ */ _jsx3(Gi2E9oIdk_default, { height: "100%", id: "TfA9XJ6qG", layoutId: "OJPhsEYYD-TfA9XJ6qG-4", name: "Client Image5", style: { width: "100%" }, width: "100%", XSz1rOWkL: addImageAlt({ pixelHeight: 20, pixelWidth: 93, src: "https://framerusercontent.com/images/gkkSyTiBsQ6NpzUiFeoxGL3mVwc.svg?width=93&height=20" }, "ticker image") }) }) })], speed: 50, style: { height: "100%", width: "100%" }, width: "100%" }) }) }) }) }) }) });
});
var css2 = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-ENelr.framer-1ysoa9h, .framer-ENelr .framer-1ysoa9h { display: block; }", ".framer-ENelr.framer-9cdlnw { align-content: center; align-items: center; display: flex; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: min-content; }", ".framer-ENelr .framer-t0r14x-container { flex: none; height: 24px; position: relative; width: 306px; }", ".framer-ENelr .framer-15vtfmz-container { height: auto; position: relative; width: 89px; }", ".framer-ENelr .framer-1h8h7s-container { height: auto; position: relative; width: 54px; }", ".framer-ENelr .framer-1uhfsel-container { height: auto; position: relative; width: 63px; }", ".framer-ENelr .framer-12ynqb-container { height: auto; position: relative; width: 81px; }", ".framer-ENelr .framer-azbxvk-container { height: auto; position: relative; width: 92px; }"];
var Framerp3U76aBhW = withCSS2(Component2, css2, "framer-ENelr");
var p3U76aBhW_default = Framerp3U76aBhW;
Framerp3U76aBhW.displayName = "Client Slider";
Framerp3U76aBhW.defaultProps = { height: 24, width: 306 };
addFonts2(Framerp3U76aBhW, [{ explicitInter: true, fonts: [] }, ...ClientImageFonts, ...TickerFonts], { supportsExplicitInterCodegen: true });
export {
  p3U76aBhW_default as default
};
