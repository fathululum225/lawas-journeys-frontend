import { api } from '@/lib/api';
import { WhatsAppButton } from './WhatsAppButton';

/**
 * Loads the chat link from the backend (GET /whatsapp/config), so changing
 * WHATSAPP_BUSINESS_NUMBER in backend/.env updates the button everywhere.
 */
export async function WhatsAppFloat() {
  try {
    const { chatUrl } = await api.whatsapp.config();
    return <WhatsAppButton chatUrl={chatUrl} />;
  } catch {
    // The API is offline: skip the button rather than showing a dead link.
    return null;
  }
}
