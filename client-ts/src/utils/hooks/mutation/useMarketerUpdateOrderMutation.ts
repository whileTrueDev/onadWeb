import { useMutation, useQueryClient } from 'react-query';
import { CourierCompany } from '../../../constants/courierCompanies';
import axios from '../../axios';
import { OrderStatus } from '../../render_funcs/renderOrderStatus';

export type MarketerUpdateOrderMutationDto = {
  orderId: string;
  status: OrderStatus;
  denialReason?: string;
  courierCompany?: CourierCompany | null;
  trackingNumber?: string | null;
};

export const useMarketerUpdateOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: MarketerUpdateOrderMutationDto) => axios.patch<boolean>('/marketer/orders', dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('marketerMerchandisesOrders');
      },
    },
  );
};
