import { ApiError } from '../../../core/api/types';

const webhookUrl = process.env.EXPO_PUBLIC_WEBHOOK_URL ?? '';

export async function submitPurchase({ title }) {
  if (!webhookUrl) {
    throw new Error('Configura EXPO_PUBLIC_WEBHOOK_URL nel file .env');
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    throw await ApiError.fromResponse(response);
  }
}
