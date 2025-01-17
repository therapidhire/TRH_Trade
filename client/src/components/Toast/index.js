// toastHelper.js
import { toast } from 'react-toastify';

// This function can be called anywhere in your app to show a toast
export const showToast = (message, type = 'error') => {
  switch (type) {
    case 'success':
      toast.success(message);
      break;
    case 'info':
      toast.info(message);
      break;
    case 'warning':
      toast.warning(message);
      break;
    case 'error':
    default:
      toast.error(message);
      break;
  }
};
