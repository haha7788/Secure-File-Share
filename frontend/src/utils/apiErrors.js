export function getErrorMessage(status, translations) {
  switch (status) {
    case 404:
      return translations.notFound;
    case 410:
      return translations.expired;
    case 403:
      return translations.incorrectPassword;
    default:
      return translations.errorLoading;
  }
}