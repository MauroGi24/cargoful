import { useMutation } from '@tanstack/react-query';

import { submitPurchase } from '../api/purchaseApi';

export function usePurchaseProduct() {
  return useMutation({
    mutationFn: submitPurchase,
  });
}
