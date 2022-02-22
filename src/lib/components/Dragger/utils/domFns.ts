/* eslint-disable @typescript-eslint/ban-types */
// @flow
import type { coordinates, MouseTouchEvent } from '@types';
import { findInArray } from '../../../utils';

export function addEvent(el: any, event: string, handler: Function, inputOptions?: Object): void {
  if (!el) return;
  const options = { capture: true, ...inputOptions };
  if (el.addEventListener) {
    el.addEventListener(event, handler, options);
  } else if (el.attachEvent) {
    el.attachEvent('on' + event, handler);
  } else {
    // $FlowIgnore: Doesn't think elements are indexable
    el['on' + event] = handler;
  }
}

export function removeEvent(
  el: any,
  event: string,
  handler: Function,
  inputOptions?: Object,
): void {
  if (!el) return;
  const options = { capture: true, ...inputOptions };
  if (el.removeEventListener) {
    el.removeEventListener(event, handler, options);
  } else if (el.detachEvent) {
    el.detachEvent('on' + event, handler);
  } else {
    // $FlowIgnore: Doesn't think elements are indexable
    el['on' + event] = null;
  }
}

// Get from offsetParent
export function offsetXYFromParent(
  evt: { clientX: number; clientY: number },
  offsetParent: HTMLElement,
  scaleRaw: () => number,
): coordinates {
  const scale = scaleRaw();

  const isBody = offsetParent === offsetParent.ownerDocument!.body;
  const offsetParentRect = isBody ? { left: 0, top: 0 } : offsetParent.getBoundingClientRect();

  const x = (evt.clientX + offsetParent.scrollLeft - offsetParentRect.left) / scale;
  const y = (evt.clientY + offsetParent.scrollTop - offsetParentRect.top) / scale;

  return { x, y };
}

export function getTouch(
  e: MouseTouchEvent,
  identifier: number,
): { clientX: number; clientY: number } {
  return (
    (e.targetTouches && findInArray(e.targetTouches, (t: any) => identifier === t.identifier)) ||
    (e.changedTouches && findInArray(e.changedTouches, (t: any) => identifier === t.identifier))
  );
}

export function getTouchIdentifier(e: MouseTouchEvent): number | undefined {
  if (e.targetTouches && e.targetTouches[0]) return e.targetTouches[0].identifier;
  if (e.changedTouches && e.changedTouches[0]) return e.changedTouches[0].identifier;
}

export function addUserSelectStyles(doc: Document) {
  if (!doc) return;
  let styleEl: any = doc.getElementById('react-draggable-style-el');
  if (!styleEl) {
    styleEl = doc.createElement('style');
    styleEl.type = 'text/css';
    styleEl.id = 'react-draggable-style-el';
    styleEl.innerHTML = '.react-dragger-in-progress *::-moz-selection {all: inherit;}\n';
    styleEl.innerHTML += '.react-dragger-in-progress *::selection {all: inherit;}\n';
    doc.getElementsByTagName('head')[0].appendChild(styleEl);
  }
  if (doc.body) addClassName(doc.body, 'react-dragger-in-progress');
}

export function removeUserSelectStyles(doc: any) {
  if (!doc) return;
  try {
    if (doc.body) removeClassName(doc.body, 'react-dragger-in-progress');
    if (doc.selection) {
      doc.selection.empty();
    } else {
      const selection = (doc.defaultView || window).getSelection();
      if (selection && selection.type !== 'Caret') {
        selection.removeAllRanges();
      }
    }
  } catch (e) {
    // probably IE
  }
}

export function addClassName(el: HTMLElement, className: string) {
  if (el.classList) {
    if (el.classList.contains(className)) return;
    el.classList.add(className);
  } else {
    if (!el.className.match(new RegExp(`(?:^|\\s)${className}(?!\\S)`))) {
      el.className += ` ${className}`;
    }
  }
}

export function removeClassName(el: HTMLElement, className: string) {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp(`(?:^|\\s)${className}(?!\\S)`, 'g'), '');
  }
}
