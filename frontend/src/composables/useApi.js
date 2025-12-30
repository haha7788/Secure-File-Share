export const getApiHeaders = (contentType = 'application/json') => {
  const headers = {
    'X-Requested-With': 'XMLHttpRequest'
  }

  if (contentType) {
    headers['Content-Type'] = contentType
  }

  return headers
}

export const apiFetch = async (url, options = {}) => {
  const isFormData = options.body instanceof FormData

  const defaultOptions = {
    headers: getApiHeaders(isFormData ? false : (options.headers?.['Content-Type'] || 'application/json'))
  }

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {})
    }
  }

  return fetch(url, mergedOptions)
}