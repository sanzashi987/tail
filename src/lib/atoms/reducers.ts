export function setHovered<T>(prev: T) {
  return {
    ...prev,
    hovered: true,
  };
}

export function setNotHovered<T>(prev: T) {
  return {
    ...prev,
    hovered: false,
  };
}
