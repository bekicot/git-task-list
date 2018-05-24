export const setObject = function(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getObject = function(key) {
  const value = localStorage.getItem(key);
  try {
    return JSON.parse(value);
  } catch (e) {
    return {};
  }
};
