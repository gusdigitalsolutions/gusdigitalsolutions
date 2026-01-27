import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FormData {
  name: string;
  email: string;
  service: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  service?: string;
  message?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    service: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const services = [
    { value: 'business-website', label: 'Business Website' },
    { value: 'shopify-store', label: 'Shopify Online Store' },
    { value: 'wordpress', label: 'WordPress Site' },
    { value: 'seo', label: 'Help Getting Found on Google' },
    { value: 'social-media', label: 'Social Media Setup' },
    { value: 'other', label: 'Something Else' },
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.service) {
      newErrors.service = 'Please select a service';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Netlify Forms submission
      const formBody = new URLSearchParams();
      formBody.append('form-name', 'contact');
      formBody.append('name', formData.name);
      formBody.append('email', formData.email);
      formBody.append('service', formData.service);
      formBody.append('message', formData.message);

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formBody.toString(),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', service: '', message: '' });
      } else {
        throw new Error('Form submission failed');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (error?: string) =>
    `w-full px-6 py-3 bg-dark-800/50 border rounded-xl text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
      error
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
        : 'border-dark-600 focus:border-primary-500 focus:ring-primary-500/20'
    }`;

  // Animation variants for form fields
  const fieldVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  };

  return (
    <motion.form
      name="contact"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="space-y-6 px-2 md:px-0"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Hidden field for Netlify */}
      <input type="hidden" name="form-name" value="contact" />
      <p className="hidden">
        <label>
          Don't fill this out if you're human: <input name="bot-field" />
        </label>
      </p>

      {/* Name */}
      <motion.div
        custom={0}
        variants={fieldVariants}
        initial="initial"
        animate="animate"
        whileTap={{ scale: 0.995 }}
        animate-hover={focusedField === 'name' ? { scale: 1.02 } : {}}
      >
        <label htmlFor="name" className="block text-sm font-medium text-dark-300 mb-2">
          Your Name
        </label>
        <motion.div
          animate={focusedField === 'name' ? { scale: 1.01 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
            className={inputClasses(errors.name)}
            maxLength={100}
            placeholder="John Doe"
          />
        </motion.div>
        <AnimatePresence>
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mt-1 text-sm text-red-400"
            >
              {errors.name}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Email */}
      <motion.div
        custom={1}
        variants={fieldVariants}
        initial="initial"
        animate="animate"
      >
        <label htmlFor="email" className="block text-sm font-medium text-dark-300 mb-2">
          Email Address
        </label>
        <motion.div
          animate={focusedField === 'email' ? { scale: 1.01 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            className={inputClasses(errors.email)}
            maxLength={254}
            placeholder="john@example.com"
          />
        </motion.div>
        <AnimatePresence>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mt-1 text-sm text-red-400"
            >
              {errors.email}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Service */}
      <motion.div
        custom={2}
        variants={fieldVariants}
        initial="initial"
        animate="animate"
      >
        <label htmlFor="service" className="block text-sm font-medium text-dark-300 mb-2">
          What do you need?
        </label>
        <motion.div
          animate={focusedField === 'service' ? { scale: 1.01 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
            onFocus={() => setFocusedField('service')}
            onBlur={() => setFocusedField(null)}
            className={inputClasses(errors.service)}
          >
            <option value="" disabled>
              Select a service...
            </option>
            {services.map((service) => (
              <option key={service.value} value={service.value}>
                {service.label}
              </option>
            ))}
          </select>
        </motion.div>
        <AnimatePresence>
          {errors.service && (
            <motion.p
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mt-1 text-sm text-red-400"
            >
              {errors.service}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Message */}
      <motion.div
        custom={3}
        variants={fieldVariants}
        initial="initial"
        animate="animate"
      >
        <label htmlFor="message" className="block text-sm font-medium text-dark-300 mb-2">
          Your Message
        </label>
        <motion.div
          animate={focusedField === 'message' ? { scale: 1.01 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            onFocus={() => setFocusedField('message')}
            onBlur={() => setFocusedField(null)}
            className={inputClasses(errors.message)}
            maxLength={5000}
            placeholder="Tell me about your project..."
          />
        </motion.div>
        <AnimatePresence>
          {errors.message && (
            <motion.p
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mt-1 text-sm text-red-400"
            >
              {errors.message}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Submit Button */}
      <motion.div
        custom={4}
        variants={fieldVariants}
        initial="initial"
        animate="animate"
      >
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-6 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl font-medium text-white shadow-lg shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -12px rgba(59, 130, 246, 0.35)' }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
            animate={{ translateX: isSubmitting ? 0 : '-100%' }}
            transition={{ repeat: isSubmitting ? Infinity : 0, duration: 1, ease: 'linear' }}
          />

          <AnimatePresence mode="wait">
            {isSubmitting ? (
              <motion.span
                key="submitting"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-center gap-2 relative z-10"
              >
                <motion.svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </motion.svg>
                Sending...
              </motion.span>
            ) : (
              <motion.span
                key="send"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-center gap-2 relative z-10"
              >
                Send Message
                <motion.svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  whileHover={{ x: 3, y: -3 }}
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </motion.svg>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* Status Messages */}
      <AnimatePresence mode="wait">
        {submitStatus === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-500/20 flex items-center justify-center"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                />
              </svg>
            </motion.div>
            <p className="font-medium">Message sent successfully!</p>
            <p className="text-sm mt-1 text-green-400/80">I'll get back to you soon.</p>
          </motion.div>
        )}

        {submitStatus === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
              transition={{ delay: 0.2 }}
              className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-500/20 flex items-center justify-center"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.div>
            <p className="font-medium">Something went wrong.</p>
            <p className="text-sm mt-1 text-red-400/80">Please try again or email me directly.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
}
