/**
 * Link de agendamento do hero. Preencher CALENDLY_URL quando a conta
 * Calendly existir — enquanto estiver vazio, o CTA cai no WhatsApp com
 * o serviço selecionado já na mensagem.
 */
import type { Locale } from '../i18n/ui';

/** Ex.: 'https://calendly.com/ricardotatagiba/30min'. Vazio = usar WhatsApp. */
export const CALENDLY_URL = '';

/** Já usado em src/pages/contato.astro */
export const WHATSAPP_NUMBER = '351961736521';

const messageTemplates: Record<Locale, (serviceLabel?: string) => string> = {
  pt: (label) => (label ? `Olá Ricardo, queria agendar uma reunião sobre ${label}.` : 'Olá Ricardo, queria agendar uma reunião.'),
  en: (label) => (label ? `Hi Ricardo, I'd like to book a meeting about ${label}.` : "Hi Ricardo, I'd like to book a meeting."),
  es: (label) => (label ? `Hola Ricardo, quería agendar una reunión sobre ${label}.` : 'Hola Ricardo, quería agendar una reunión.'),
};

export function bookingUrl(serviceLabel?: string, lang: Locale = 'pt'): string {
  if (CALENDLY_URL) {
    const url = new URL(CALENDLY_URL);
    if (serviceLabel) url.searchParams.set('a1', serviceLabel);
    return url.toString();
  }

  const message = messageTemplates[lang](serviceLabel);

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
