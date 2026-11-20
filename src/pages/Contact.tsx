import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, MessageCircle, Send } from 'lucide-react';
import {
  SHOP_NAME,
  ADDRESS,
  HOURS,
  PHONE,
  WHATSAPP_NUMBER,
  EMAIL,
  INSTAGRAM,
} from '../config/shop';
import { Button } from '../components/ui/Button';

export default function Contact(): React.ReactElement {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.title = `Contact Us — ${SHOP_NAME}`;
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = `Hi Trendy Jeans, my name is ${name.trim()} (${phone.trim()}). ${message.trim()}`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(formatted)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="page-container py-10 md:py-16 max-w-4xl">
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="label-caps text-gold block mb-2">GET IN TOUCH</span>
        <h1 className="text-3xl md:text-5xl font-heading font-semibold text-ink mb-4">
          Visit or talk to us
        </h1>
        <p className="text-muted text-sm md:text-base leading-relaxed">
          Have questions about fits, sizing, or want to check live store availability? Reach out directly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Store Details Card */}
        <div className="bg-surface rounded-card p-6 md:p-8 border border-line shadow-soft space-y-6">
          <h2 className="text-xl font-heading font-semibold text-ink pb-3 border-b border-line">
            Store Information
          </h2>

          <div className="space-y-4 text-sm text-ink">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-xs uppercase tracking-wider text-muted mb-0.5">Address</strong>
                <span>{ADDRESS}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-xs uppercase tracking-wider text-muted mb-0.5">Hours</strong>
                <span>{HOURS}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-xs uppercase tracking-wider text-muted mb-0.5">Phone & WhatsApp</strong>
                <p>
                  <a href={`tel:${PHONE.replace(/\s+/g, '')}`} className="hover:text-gold transition-colors font-medium">
                    {PHONE}
                  </a>
                </p>
                <p className="text-xs text-muted mt-0.5">{EMAIL}</p>
                <p className="text-xs font-mono text-muted mt-1">{INSTAGRAM}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-line flex flex-col sm:flex-row gap-3">
            <a
              href={`tel:${PHONE.replace(/\s+/g, '')}`}
              className="btn-secondary flex-1 justify-center text-xs"
            >
              <Phone className="w-3.5 h-3.5 mr-2" />
              <span>Call Store</span>
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="btn-primary flex-1 justify-center text-xs bg-[#25D366] hover:bg-[#20ba59] text-white border-none"
            >
              <MessageCircle className="w-3.5 h-3.5 mr-2" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>

        {/* Direct WhatsApp message form */}
        <div className="bg-surface rounded-card p-6 md:p-8 border border-line shadow-soft">
          <h2 className="text-xl font-heading font-semibold text-ink pb-3 border-b border-line mb-6">
            Send a Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="contact-name" className="label-caps text-xs text-muted block mb-1.5">
                Your Name *
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahul Sharma"
                className="w-full min-h-[48px] px-4 rounded-input border border-line bg-bg text-sm text-ink focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label htmlFor="contact-phone" className="label-caps text-xs text-muted block mb-1.5">
                Phone Number *
              </label>
              <input
                id="contact-phone"
                type="tel"
                inputMode="numeric"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full min-h-[48px] px-4 rounded-input border border-line bg-bg text-sm text-ink focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="label-caps text-xs text-muted block mb-1.5">
                Message *
              </label>
              <textarea
                id="contact-message"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi, I wanted to enquire about size availability for jeans..."
                className="w-full p-4 rounded-input border border-line bg-bg text-sm text-ink focus:outline-none focus:border-gold resize-none"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full">
              <Send className="w-4 h-4 mr-2" />
              <span>Open in WhatsApp</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
