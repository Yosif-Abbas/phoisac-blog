export function formatDate(date?: string | Date) {
  if (!date) return "";

  const now = new Date();
  const d = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  // 1. "Just now" for anything under a minute
  if (diffInSeconds < 60) {
    return "الآن";
  }

  // 2. Calculate thresholds
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInSeconds / 3600);
  const diffInDays = Math.floor(diffInHours / 24);

  const rtf = new Intl.RelativeTimeFormat("ar-EG", { numeric: "always" });

  // 3. Less than an hour -> show minutes
  if (diffInMinutes < 60) {
    return rtf.format(-diffInMinutes, "minute");
  }

  // 4. Less than a day -> show hours
  if (diffInHours < 24) {
    return rtf.format(-diffInHours, "hour");
  }

  // 5. Less than a week -> show days
  if (diffInDays < 7) {
    return rtf.format(-diffInDays, "day");
  }

  // 6. Fallback to absolute date for older posts
  const day = d.toLocaleString("ar-EG", { day: "2-digit" });
  const month = d.toLocaleString("ar-EG", { month: "short" });
  const year = d.toLocaleString("ar-EG", { year: "numeric" });

  return `${day} ${month} ${year}`;
}
