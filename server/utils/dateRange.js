export const getDateRange = (query) => {
  const now = new Date();

  if (query.from && query.to) {
    return {
      from: new Date(query.from),
      to: new Date(query.to),
    };
  }

  switch (query.range) {
    case "7d":
      return { from: new Date(now.setDate(now.getDate() - 7)), to: new Date() };
    case "30d":
      return { from: new Date(now.setDate(now.getDate() - 30)), to: new Date() };
    case "6m":
      return { from: new Date(now.setMonth(now.getMonth() - 6)), to: new Date() };
    case "1y":
      return { from: new Date(now.setFullYear(now.getFullYear() - 1)), to: new Date() };
    default:
      return { from: null, to: null };
  }
};
