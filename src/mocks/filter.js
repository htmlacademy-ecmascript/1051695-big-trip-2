
function generateFilter(filter) {
  return Object.entries(filter).map(
    ([filterType, filterTasks]) => ({
      type: filterType,
      count: filterTasks.length,
    }),
  );
}

export {generateFilter};
