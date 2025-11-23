/**
 * Composable для форматирования дат, времени и цен
 */
export const useFormatters = () => {
  /**
   * Форматирует дату в читаемый формат
   * @param date - Дата в формате ISO string
   * @returns Отформатированная дата (например: "21 ноября 2025")
   */
  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  /**
   * Форматирует время из datetime строки
   * @param datetime - Дата и время в формате ISO string
   * @returns Отформатированное время (например: "14:30")
   */
  const formatTime = (datetime: string): string => {
    return new Date(datetime).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Форматирует дату и время вместе
   * @param timestamp - Дата и время в формате ISO string
   * @returns Отформатированная дата и время (например: "21 ноября 2025, 14:30")
   */
  const formatTimestamp = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Форматирует цену в рубли
   * @param price - Цена (число или строка)
   * @returns Отформатированная цена (например: "5 000 ₽")
   */
  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
    }).format(numPrice);
  };

  /**
   * Форматирует число с разделителями тысяч
   * @param value - Число для форматирования
   * @returns Отформатированное число (например: "1 234 567")
   */
  const formatNumber = (value: number | string): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('ru-RU').format(numValue);
  };

  /**
   * Форматирует дату в короткий формат
   * @param date - Дата в формате ISO string
   * @returns Короткая дата (например: "21.11.2025")
   */
  const formatDateShort = (date: string): string => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  /**
   * Форматирует относительное время (например: "2 дня назад")
   * @param date - Дата в формате ISO string
   * @returns Относительное время
   */
  const formatRelativeTime = (date: string): string => {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

    const intervals = {
      год: 31536000,
      месяц: 2592000,
      неделя: 604800,
      день: 86400,
      час: 3600,
      минута: 60,
    };

    for (const [unit, seconds] of Object.entries(intervals)) {
      const interval = Math.floor(diffInSeconds / seconds);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? (unit === 'месяц' ? 'а' : unit === 'день' ? 'дня' : unit === 'час' ? 'а' : unit === 'минута' ? 'ы' : 'ов') : ''} назад`;
      }
    }

    return 'только что';
  };

  return {
    formatDate,
    formatTime,
    formatTimestamp,
    formatPrice,
    formatNumber,
    formatDateShort,
    formatRelativeTime,
  };
};

