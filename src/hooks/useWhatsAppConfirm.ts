'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';

/**
 * "Confirm via WhatsApp": asks the backend to prepare the booking message
 * (POST /api/whatsapp/notify) and opens the chat link it returns.
 */
export function useWhatsAppConfirm() {
  const showToast = useToast();
  const [pending, setPending] = useState(false);

  const confirm = async (bookingCode: string): Promise<void> => {
    // Opened synchronously so popup blockers treat it as a response to the click.
    const chatWindow = window.open('', '_blank');
    setPending(true);

    try {
      const notification = await api.whatsapp.notify(bookingCode);

      if (chatWindow) chatWindow.location.href = notification.url;
      else window.location.href = notification.url;
    } catch (error) {
      chatWindow?.close();
      showToast(error instanceof Error ? error.message : String(error), 'error');
    } finally {
      setPending(false);
    }
  };

  return { confirm, pending };
}
