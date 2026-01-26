import { format as formatDateFn } from 'date-fns';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export const formatDate = (date: Date | string, formatStr: string = 'dd/MM/yyyy'): string => {
  return formatDateFn(new Date(date), formatStr);
};

export const formatTime = (date: Date | string): string => {
  return formatDateFn(new Date(date), 'HH:mm');
};

