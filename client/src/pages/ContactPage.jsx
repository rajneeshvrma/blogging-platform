import React from 'react';
import InfoPageLayout from './InfoPageLayout';
import Button from '../components/common/Button';

const ContactPage = () => (
  <InfoPageLayout title="Contact Us">
    <p>
      Have a question, feedback, or just want to say hello? We'd love to hear from you. 
      Fill out the form below, and a member of our team will get back to you as soon as possible.
    </p>
    <form className="mt-8 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Full Name</label>
            <input type="text" name="name" id="name" required className="mt-1 block w-full px-3 py-2 border border-glass bg-transparent rounded-md focus:ring-indigo-500 focus:border-indigo-500"/>
        </div>
        <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary">Email Address</label>
            <input type="email" name="email" id="email" required className="mt-1 block w-full px-3 py-2 border border-glass bg-transparent rounded-md focus:ring-indigo-500 focus:border-indigo-500"/>
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-text-secondary">Subject</label>
        <input type="text" name="subject" id="subject" required className="mt-1 block w-full px-3 py-2 border border-glass bg-transparent rounded-md focus:ring-indigo-500 focus:border-indigo-500"/>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-text-secondary">Message</label>
        <textarea name="message" id="message" rows="6" required className="mt-1 block w-full px-3 py-2 border border-glass bg-transparent rounded-md focus:ring-indigo-500 focus:border-indigo-500"></textarea>
      </div>
      <div>
        <Button type="submit">Send Message</Button>
      </div>
    </form>
  </InfoPageLayout>
);

export default ContactPage;