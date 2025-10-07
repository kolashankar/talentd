import emailjs from '@emailjs/browser';

// Initialize EmailJS with public key
export function initEmailJS(publicKey: string) {
  emailjs.init(publicKey);
}

// Send email using EmailJS
export async function sendEmail(
  serviceId: string,
  templateId: string,
  templateParams: Record<string, any>
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await emailjs.send(serviceId, templateId, templateParams);
    
    if (response.status === 200) {
      return {
        success: true,
        message: 'Message sent successfully!',
      };
    }
    
    throw new Error('Failed to send message');
  } catch (error) {
    console.error('EmailJS error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send message',
    };
  }
}

// Default template parameters structure
export interface ContactFormData {
  from_name: string;
  from_email: string;
  to_name: string;
  message: string;
  reply_to?: string;
}

// Contact form component with EmailJS
export async function sendContactForm(
  config: {
    serviceId: string;
    templateId: string;
    userId?: string;
  },
  formData: ContactFormData
): Promise<{ success: boolean; message: string }> {
  // Initialize if userId is provided
  if (config.userId) {
    initEmailJS(config.userId);
  }

  return sendEmail(config.serviceId, config.templateId, {
    from_name: formData.from_name,
    from_email: formData.from_email,
    to_name: formData.to_name,
    message: formData.message,
    reply_to: formData.reply_to || formData.from_email,
  });
}
