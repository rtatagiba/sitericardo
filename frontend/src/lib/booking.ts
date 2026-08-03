/**
 * Link de agendamento do hero. Preencher CALENDLY_URL quando a conta
 * Calendly existir — enquanto estiver vazio, o CTA cai no WhatsApp com
 * o serviço selecionado já na mensagem.
 */

/** Ex.: 'https://calendly.com/ricardotatagiba/30min'. Vazio = usar WhatsApp. */
export const CALENDLY_URL = '';

/** Já usado em src/pages/contato.astro */
export const WHATSAPP_NUMBER = '351961736521';

export function bookingUrl(serviceLabel?: string): string {
  if (CALENDLY_URL) {
    const url = new URL(CALENDLY_URL);
    if (serviceLabel) url.searchParams.set('a1', serviceLabel);
    return url.toString();
  }

  const message = serviceLabel
    ? `Olá Ricardo, queria agendar uma reunião sobre ${serviceLabel}.`
    : 'Olá Ricardo, queria agendar uma reunião.';

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
