export function formatDateRelative(date) {
  if (!date) return null;
  const now = new Date();
  const minuteDifference = (now - date) / 1000 / 60;

  // Less than an hour ago
  if (minuteDifference < 60) {
    const formatter = new Intl.RelativeTimeFormat("en", { style: "long" });
    return formatter.format(-Math.ceil(minuteDifference), "minute");
  }

  // Less than a day ago
  if (minuteDifference < 24 * 60) {
    const formatter = new Intl.RelativeTimeFormat("en", { style: "long" });
    return formatter.format(-Math.floor(minuteDifference / 60), "hour");
  }

  // Less than 2 days ago
  if (minuteDifference < 24 * 60 * 2) {
    const formatter = new Intl.DateTimeFormat(undefined, {
      timeStyle: "short",
    });
    return "Yesterday at " + formatter.format(date);
  }

  // Less than 4 days ago
  if (minuteDifference < 24 * 60 * 4) {
    const formatter = new Intl.DateTimeFormat(undefined, {
      timeStyle: "short",
    });
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    return "on " + weekdays[date.getDay()] + " at " + formatter.format(date);
  }

  const formatter = new Intl.DateTimeFormat(undefined, {
    timeStyle: "short",
    dateStyle: "long",
  });
  return "on " + formatter.format(date);
}
