import { useState, useRef, useEffect, type FormEvent } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

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

  // Refs for GSAP animations
  const formRef = useRef<HTMLFormElement>(null);
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<SVGSVGElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const checkmarkRef = useRef<SVGPathElement>(null);
  const successIconRef = useRef<HTMLDivElement>(null);
  const errorIconRef = useRef<HTMLDivElement>(null);
  const sendIconRef = useRef<SVGSVGElement>(null);

  // Error message refs
  const nameErrorRef = useRef<HTMLParagraphElement>(null);
  const emailErrorRef = useRef<HTMLParagraphElement>(null);
  const serviceErrorRef = useRef<HTMLParagraphElement>(null);
  const messageErrorRef = useRef<HTMLParagraphElement>(null);

  // Field wrapper refs for focus animation
  const nameWrapperRef = useRef<HTMLDivElement>(null);
  const emailWrapperRef = useRef<HTMLDivElement>(null);
  const serviceWrapperRef = useRef<HTMLDivElement>(null);
  const messageWrapperRef = useRef<HTMLDivElement>(null);

  // Shimmer animation timeline
  const shimmerTl = useRef<gsap.core.Timeline | null>(null);
  // Spinner animation
  const spinnerTween = useRef<gsap.core.Tween | null>(null);

  const services = [
    { value: 'business-website', label: 'Business Website' },
    { value: 'shopify-store', label: 'Shopify Online Store' },
    { value: 'wordpress', label: 'WordPress Site' },
    { value: 'seo', label: 'Help Getting Found on Google' },
    { value: 'social-media', label: 'Social Media Setup' },
    { value: 'other', label: 'Something Else' },
  ];

  // Initial form and field animations
  useGSAP(() => {
    // Form entrance animation
    if (formRef.current) {
      gsap.from(formRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power2.out',
      });
    }

    // Field stagger animations
    const validFields = fieldRefs.current.filter(Boolean);
    if (validFields.length > 0) {
      gsap.from(validFields, {
        opacity: 0,
        y: 20,
        duration: 0.4,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.2,
      });
    }
  }, { scope: formRef });

  // Handle shimmer animation based on isSubmitting
  useEffect(() => {
    if (isSubmitting && shimmerRef.current) {
      // Start shimmer animation
      gsap.set(shimmerRef.current, { x: '-100%' });
      shimmerTl.current = gsap.timeline({ repeat: -1 });
      shimmerTl.current.to(shimmerRef.current, {
        x: '100%',
        duration: 1,
        ease: 'linear',
      });
    } else {
      // Stop shimmer animation
      if (shimmerTl.current) {
        shimmerTl.current.kill();
        shimmerTl.current = null;
      }
      if (shimmerRef.current) {
        gsap.set(shimmerRef.current, { x: '-100%' });
      }
    }

    return () => {
      if (shimmerTl.current) {
        shimmerTl.current.kill();
      }
    };
  }, [isSubmitting]);

  // Handle spinner animation
  useEffect(() => {
    if (isSubmitting && spinnerRef.current) {
      spinnerTween.current = gsap.to(spinnerRef.current, {
        rotation: 360,
        repeat: -1,
        duration: 1,
        ease: 'linear',
      });
    } else {
      if (spinnerTween.current) {
        spinnerTween.current.kill();
        spinnerTween.current = null;
      }
      if (spinnerRef.current) {
        gsap.set(spinnerRef.current, { rotation: 0 });
      }
    }

    return () => {
      if (spinnerTween.current) {
        spinnerTween.current.kill();
      }
    };
  }, [isSubmitting]);

  // Handle success message animation
  useEffect(() => {
    if (submitStatus === 'success' && successRef.current) {
      gsap.fromTo(
        successRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' }
      );

      // Animate the icon
      if (successIconRef.current) {
        gsap.fromTo(
          successIconRef.current,
          { scale: 0 },
          { scale: 1, duration: 0.4, delay: 0.2, ease: 'elastic.out(1, 0.5)' }
        );
      }

      // Animate checkmark path
      if (checkmarkRef.current) {
        const pathLength = checkmarkRef.current.getTotalLength();
        gsap.set(checkmarkRef.current, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });
        gsap.to(checkmarkRef.current, {
          strokeDashoffset: 0,
          duration: 0.4,
          delay: 0.4,
          ease: 'power2.out',
        });
      }
    }
  }, [submitStatus]);

  // Handle error message animation
  useEffect(() => {
    if (submitStatus === 'error' && errorRef.current) {
      gsap.fromTo(
        errorRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' }
      );

      // Animate the icon with shake
      if (errorIconRef.current) {
        gsap.fromTo(
          errorIconRef.current,
          { scale: 0 },
          { scale: 1, duration: 0.3, delay: 0.2, ease: 'back.out(1.7)' }
        );
        gsap.to(errorIconRef.current, {
          rotation: [-10, 10, -10, 0],
          duration: 0.4,
          delay: 0.3,
          ease: 'power2.out',
        });
      }
    }
  }, [submitStatus]);

  // Animate field errors
  useEffect(() => {
    const animateError = (ref: React.RefObject<HTMLParagraphElement | null>, hasError: boolean) => {
      if (hasError && ref.current) {
        gsap.fromTo(
          ref.current,
          { opacity: 0, y: -10, height: 0 },
          { opacity: 1, y: 0, height: 'auto', duration: 0.3, ease: 'power2.out' }
        );
      }
    };

    animateError(nameErrorRef, !!errors.name);
    animateError(emailErrorRef, !!errors.email);
    animateError(serviceErrorRef, !!errors.service);
    animateError(messageErrorRef, !!errors.message);
  }, [errors]);

  // Handle field focus animations
  useEffect(() => {
    const wrapperMap: Record<string, React.RefObject<HTMLDivElement | null>> = {
      name: nameWrapperRef,
      email: emailWrapperRef,
      service: serviceWrapperRef,
      message: messageWrapperRef,
    };

    // Reset all wrappers
    Object.values(wrapperMap).forEach((ref) => {
      if (ref.current) {
        gsap.to(ref.current, { scale: 1, duration: 0.2 });
      }
    });

    // Scale up focused wrapper
    if (focusedField && wrapperMap[focusedField]?.current) {
      gsap.to(wrapperMap[focusedField].current, { scale: 1.01, duration: 0.2 });
    }
  }, [focusedField]);

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

  // Button hover handlers
  const handleButtonMouseEnter = () => {
    if (buttonRef.current && !isSubmitting) {
      gsap.to(buttonRef.current, {
        scale: 1.02,
        boxShadow: '0 20px 40px -12px rgba(59, 130, 246, 0.35)',
        duration: 0.2,
      });
    }
    if (sendIconRef.current && !isSubmitting) {
      gsap.to(sendIconRef.current, { x: 3, y: -3, duration: 0.2 });
    }
  };

  const handleButtonMouseLeave = () => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 1,
        boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.25)',
        duration: 0.2,
      });
    }
    if (sendIconRef.current) {
      gsap.to(sendIconRef.current, { x: 0, y: 0, duration: 0.2 });
    }
  };

  const handleButtonMouseDown = () => {
    if (buttonRef.current && !isSubmitting) {
      gsap.to(buttonRef.current, { scale: 0.98, duration: 0.1 });
    }
  };

  const handleButtonMouseUp = () => {
    if (buttonRef.current && !isSubmitting) {
      gsap.to(buttonRef.current, { scale: 1.02, duration: 0.1 });
    }
  };

  const inputClasses = (error?: string) =>
    `w-full px-6 py-3 bg-dark-800/50 border rounded-xl text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
      error
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
        : 'border-dark-600 focus:border-primary-500 focus:ring-primary-500/20'
    }`;

  return (
    <form
      ref={formRef}
      name="contact"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="space-y-6 px-2 md:px-0"
    >
      {/* Hidden field for Netlify */}
      <input type="hidden" name="form-name" value="contact" />
      <p className="hidden">
        <label>
          Don't fill this out if you're human: <input name="bot-field" />
        </label>
      </p>

      {/* Name */}
      <div ref={(el) => { fieldRefs.current[0] = el; }}>
        <label htmlFor="name" className="block text-sm font-medium text-dark-300 mb-2">
          Your Name
        </label>
        <div ref={nameWrapperRef}>
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
        </div>
        {errors.name && (
          <p ref={nameErrorRef} className="mt-1 text-sm text-red-400">
            {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div ref={(el) => { fieldRefs.current[1] = el; }}>
        <label htmlFor="email" className="block text-sm font-medium text-dark-300 mb-2">
          Email Address
        </label>
        <div ref={emailWrapperRef}>
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
        </div>
        {errors.email && (
          <p ref={emailErrorRef} className="mt-1 text-sm text-red-400">
            {errors.email}
          </p>
        )}
      </div>

      {/* Service */}
      <div ref={(el) => { fieldRefs.current[2] = el; }}>
        <label htmlFor="service" className="block text-sm font-medium text-dark-300 mb-2">
          What do you need?
        </label>
        <div ref={serviceWrapperRef}>
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
        </div>
        {errors.service && (
          <p ref={serviceErrorRef} className="mt-1 text-sm text-red-400">
            {errors.service}
          </p>
        )}
      </div>

      {/* Message */}
      <div ref={(el) => { fieldRefs.current[3] = el; }}>
        <label htmlFor="message" className="block text-sm font-medium text-dark-300 mb-2">
          Your Message
        </label>
        <div ref={messageWrapperRef}>
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
        </div>
        {errors.message && (
          <p ref={messageErrorRef} className="mt-1 text-sm text-red-400">
            {errors.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div ref={(el) => { fieldRefs.current[4] = el; }}>
        <button
          ref={buttonRef}
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-6 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl font-medium text-white shadow-lg shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          onMouseEnter={handleButtonMouseEnter}
          onMouseLeave={handleButtonMouseLeave}
          onMouseDown={handleButtonMouseDown}
          onMouseUp={handleButtonMouseUp}
        >
          {/* Shimmer effect */}
          <div
            ref={shimmerRef}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{ transform: 'translateX(-100%)' }}
          />

          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2 relative z-10">
              <svg
                ref={spinnerRef}
                className="h-5 w-5"
                viewBox="0 0 24 24"
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
              </svg>
              Sending...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2 relative z-10">
              Send Message
              <svg
                ref={sendIconRef}
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </span>
          )}
        </button>
      </div>

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div
          ref={successRef}
          className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-center"
          style={{ opacity: 0 }}
        >
          <div
            ref={successIconRef}
            className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-500/20 flex items-center justify-center"
            style={{ transform: 'scale(0)' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                ref={checkmarkRef}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="font-medium">Message sent successfully!</p>
          <p className="text-sm mt-1 text-green-400/80">I'll get back to you soon.</p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div
          ref={errorRef}
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-center"
          style={{ opacity: 0 }}
        >
          <div
            ref={errorIconRef}
            className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-500/20 flex items-center justify-center"
            style={{ transform: 'scale(0)' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="font-medium">Something went wrong.</p>
          <p className="text-sm mt-1 text-red-400/80">Please try again or email me directly.</p>
        </div>
      )}
    </form>
  );
}
