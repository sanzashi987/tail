import React from 'react';

type EventCollection = MouseEvent | React.MouseEvent;

type OS = 'win' | 'mac' | 'linux' | 'unix' | undefined;
export const getOS = (): OS => {
  let OSName: OS;
  if (navigator.appVersion.indexOf('Win') !== -1) OSName = 'win';
  if (navigator.appVersion.indexOf('Mac') !== -1) OSName = 'mac';
  if (navigator.appVersion.indexOf('X11') !== -1) OSName = 'unix';
  if (navigator.appVersion.indexOf('Linux') !== -1) OSName = 'linux';
  return OSName;
};

export const isMac = getOS() === 'mac';

export function isModifierExact(e: EventCollection) {
  return (
    [e.ctrlKey, e.metaKey, e.altKey, e.shiftKey].reduce((val, key) => {
      if (key) ++val;
      return val;
    }, 0) === 1
  );
}

export function CtrlOrCmd(e: EventCollection) {
  return getOS() ? e.metaKey : e.ctrlKey;
}

export function preventDefault(e: Event | React.UIEvent) {
  e.preventDefault();
}
