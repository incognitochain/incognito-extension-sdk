export const getOriginalURL = () => {
  return window.location.origin;
};

export const handlePostEvent = (eventName, data) => {
  const customData = Object.assign(data || {}, {name: eventName} );
  const event = new CustomEvent(eventName, { detail: customData });
  window.dispatchEvent(event);
};