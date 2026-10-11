export const formatCurrency = (value: number, currency = "USD"): string => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return value.toFixed(2);
  }
};

export const formatSubscriptionDateTime = (value?: string): string => {
  if (!value) return "Not provided";
  if (/^[A-Za-z]+\s+\d{1,2}(?:,\s*\d{1,2}:\d{2})?$/.test(value.trim())) {
    return value;
  }
  const parsedDate = new Date(value);
  if (isNaN(parsedDate.getTime())) return value;
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  const year = parsedDate.getFullYear();
  return `${month}/${day}/${year}`;
};

export const formatStatusLabel = (value?: string): string => {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const formatShortDate = (value?: string): string => {
  if (!value) return "04/21";
  const parsedDate = new Date(value);
  if (isNaN(parsedDate.getTime())) return "04/21";
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  return `${month}/${day}`;
};