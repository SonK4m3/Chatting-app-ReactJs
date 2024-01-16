export function convertTimestampToTime(timestamp) {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

export function compareTimestampWithCurrentTime(timestamp) {
  const currentTime = new Date().getTime();

  return convertTimestampToTime(currentTime - timestamp);
}

export function objectToQueryString(obj) {
  const queryString = Object.entries(obj)
    .map(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        return value.map((item) => `${key}=${encodeURI(item)}`).join("&");
      } else if (value !== "") {
        return `${key}=${encodeURI(value)}`;
      }
    })
    .join("&");

  return queryString;
}

export function getCurrentTimeAsTimestamp() {
  const currentTime = new Date();
  const timestamp = currentTime.getTime();
  return timestamp;
}
