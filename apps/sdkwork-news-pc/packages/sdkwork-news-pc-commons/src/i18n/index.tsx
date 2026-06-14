export interface I18nMessages {
  [key: string]: string;
}

export interface I18n {
  t(key: string, params?: Record<string, string | number>): string;
  locale: string;
}

export function createI18n(locale: string = 'en', messages: I18nMessages = {}): I18n {
  return {
    t(key: string, params?: Record<string, string | number>): string {
      let message = messages[key] || key;
      if (params) {
        for (const [paramKey, paramValue] of Object.entries(params)) {
          message = message.replace(`{${paramKey}}`, String(paramValue));
        }
      }
      return message;
    },
    locale,
  };
}
