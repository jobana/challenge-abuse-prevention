export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatDate = (date: string | Date, locale: string = 'es-ES'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

export const formatDateTime = (date: string | Date, locale: string = 'es-ES'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

export const formatPhone = (phone: string): string => {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Format based on length
  if (digits.length === 10) {
    return digits.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  } else if (digits.length === 11 && digits.startsWith('1')) {
    return digits.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
  }
  
  return phone; // Return original if can't format
};

export const formatCardNumber = (cardNumber: string): string => {
  // Remove all non-digits
  const digits = cardNumber.replace(/\D/g, '');
  
  // Add spaces every 4 digits
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
};

export const formatExpiryDate = (expiryDate: string): string => {
  // Remove all non-digits
  const digits = expiryDate.replace(/\D/g, '');
  
  // Format as MM/YY
  if (digits.length >= 2) {
    return digits.substring(0, 2) + '/' + digits.substring(2, 4);
  }
  
  return digits;
};

export const formatDocumentNumber = (documentNumber: string, documentType: string): string => {
  const digits = documentNumber.replace(/\D/g, '');
  
  switch (documentType) {
    case 'dni':
      return digits.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3');
    case 'cedula':
      return digits.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
    default:
      return documentNumber;
  }
};

export const formatAddress = (address: any): string => {
  if (!address) return '';
  
  const parts = [
    address.street,
    address.number,
    address.apartment,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ].filter(Boolean);
  
  return parts.join(', ');
};

export const formatName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`.trim();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
