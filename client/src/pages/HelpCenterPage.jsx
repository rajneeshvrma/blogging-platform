import React from 'react';
import InfoPageLayout from './InfoPageLayout';

const HelpCenterPage = () => (
  <InfoPageLayout title="Help Center">
    <h3>Getting Started</h3>
    <p>To start your journey with GlassBlog, simply sign up for a free account. Once registered, you can create your first post from your dashboard.</p>
    
    <h3>Writing and Editing</h3>
    <p>Our editor allows you to format your text, add images, and embed content seamlessly. All your drafts are auto-saved, so you never lose your work.</p>
    
    <h3>Contact Support</h3>
    <p>If you can't find the answer you're looking for, please visit our <a href="/contact">Contact Page</a> to get in touch with our support team directly.</p>
  </InfoPageLayout>
);

export default HelpCenterPage;