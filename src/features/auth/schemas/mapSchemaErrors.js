export function mapSchemaErrors(issues) {
  return issues.reduce((errors, issue) => {
    const field = issue.path[0];

    if (field && !errors[field]) {
      errors[field] = issue.message;
    }

    return errors;
  }, {});
}
