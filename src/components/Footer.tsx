/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface FooterProps {
  onSdgClick: () => void;
  onLinkClick?: (title: string, content: string) => void;
}

export default function Footer({ onSdgClick, onLinkClick }: FooterProps) {
  const handleGenericLink = (e: React.MouseEvent, title: string) => {
    e.preventDefault();
    let content = '';

    switch (title) {
      case 'Privacy':
        content = 'Your data privacy is secured with dual-signature hash matching under MySewa protocol guidelines. We never compromise on tenant-landlord direct contact logs.';
        break;
      case 'Terms':
        content = 'Our Lease agreement templates are built on top of standard legal constructs, fortified with micro-fractional bond models in accordance with UN SDG 9 guidelines.';
        break;
      case 'Contact':
        content = 'Get in touch with the MySewa Innovation Team: support@mysewa.io or visit our physical Innovation Center at Block B, Industrial District.';
        break;
      case 'Social Media':
        content = 'Follow our SDG 9 developments on LinkedIn, Twitter (@MySewaProp), and GitHub. Together we bridge the structural housing gap!';
        break;
      default:
        content = 'Standard MySewa platform information aligned with sector-level asset building and high-security compliance.';
    }

    onLinkClick?.(title, content);
  };

  return (
    <footer className="bg-surface-dim border-t border-surface-container-high py-12 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-16 w-full max-w-(--spacing-max-width) mx-auto gap-6 md:gap-0">
        <div className="space-y-2 text-center md:text-left">
          <div className="text-xl font-bold text-on-surface">
            MySewa
          </div>
          <p className="text-xs text-on-surface-variant max-w-xs">
            © 2024 MySewa. Aligned with SDG 9: Industry, Innovation and Infrastructure.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <a
            onClick={(e) => { e.preventDefault(); onSdgClick(); }}
            className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer font-medium"
            href="#sdg-portal"
            id="footer-link-about"
          >
            About SDG 9
          </a>
          <a
            onClick={(e) => handleGenericLink(e, 'Privacy')}
            className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer font-medium"
            href="#"
            id="footer-link-privacy"
          >
            Privacy Policy
          </a>
          <a
            onClick={(e) => handleGenericLink(e, 'Terms')}
            className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer font-medium"
            href="#"
            id="footer-link-terms"
          >
            Terms of Use
          </a>
          <a
            onClick={(e) => handleGenericLink(e, 'Contact')}
            className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer font-medium"
            href="#"
            id="footer-link-contact"
          >
            Contact
          </a>
          <a
            onClick={(e) => handleGenericLink(e, 'Social Media')}
            className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer font-medium"
            href="#"
            id="footer-link-social"
          >
            Social Media
          </a>
        </div>
      </div>
    </footer>
  );
}
