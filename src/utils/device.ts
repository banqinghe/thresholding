export function isMobile() {
  return /Mobi|Android|iPhone/i.test(navigator.userAgent);
}

export function getLanguage() {
  return navigator.language;
}
