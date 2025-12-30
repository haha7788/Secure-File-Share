export function useFormatters() {
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat('ru-RU').format(num)
  }

  const formatDate = (dateString, locale = 'ru-RU') => {
    return new Date(dateString).toLocaleString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTimeRemaining = (expiryDate, lang = 'ru') => {
    const now = new Date()
    const expiry = new Date(expiryDate)
    const diff = expiry - now

    if (diff <= 0) return lang === 'ru' ? 'Истёк' : 'Expired'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    const parts = []

    if (days > 0) {
      parts.push(lang === 'ru'
        ? `${days} ${days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}`
        : `${days} ${days === 1 ? 'day' : 'days'}`)
    }

    if (hours > 0 || days > 0) {
      parts.push(lang === 'ru'
        ? `${hours} ${hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов'}`
        : `${hours} ${hours === 1 ? 'hour' : 'hours'}`)
    }

    if (days === 0 && minutes > 0) {
      parts.push(lang === 'ru'
        ? `${minutes} ${minutes === 1 ? 'минута' : minutes < 5 ? 'минуты' : 'минут'}`
        : `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`)
    }

    if (days === 0 && hours === 0) {
      parts.push(lang === 'ru'
        ? `${seconds} ${seconds === 1 ? 'секунда' : seconds < 5 ? 'секунды' : 'секунд'}`
        : `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`)
    }

    return parts.join(' ')
  }

  return {
    formatBytes,
    formatNumber,
    formatDate,
    getTimeRemaining
  }
}