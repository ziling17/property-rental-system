/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Cpu, UserCheck } from 'lucide-react';

export default function TrustBadges() {
  return (
    <section className="max-w-(--spacing-max-width) mx-auto px-6 md:px-16 pb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Badge 1: Secure Infrastructure */}
      <div id="badge-secure-infra" className="bg-surface-container rounded-2xl p-6 flex items-start gap-4 hover:shadow-md transition-all duration-300">
        <div id="icon-shield-container" className="bg-primary/10 text-primary p-3 rounded-xl flex items-center justify-center shrink-0">
          <ShieldCheck size={24} className="text-primary font-bold" />
        </div>
        <div>
          <h4 className="font-semibold text-on-surface text-base mb-1">
            Secure Infrastructure
          </h4>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Advanced encryption and secure deposit handling for your peace of mind.
          </p>
        </div>
      </div>

      {/* Badge 2: SDG 9 Driven */}
      <div id="badge-sdg9-driven" className="bg-surface-container rounded-2xl p-6 flex items-start gap-4 border-l-4 border-tertiary-container hover:shadow-md transition-all duration-300">
        <div id="icon-cpu-container" className="bg-tertiary-container text-on-tertiary-container p-3 rounded-xl flex items-center justify-center shrink-0">
          <Cpu size={24} className="text-[#a18100]" />
        </div>
        <div>
          <h4 className="font-semibold text-on-surface text-base mb-1">
            SDG 9 Driven
          </h4>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Scaling industrial and innovative leasing tools to bridge infrastructure gaps.
          </p>
        </div>
      </div>

      {/* Badge 3: Verified Community */}
      <div id="badge-verified-comm" className="bg-surface-container rounded-2xl p-6 flex items-start gap-4 hover:shadow-md transition-all duration-300">
        <div id="icon-community-container" className="bg-secondary-container text-on-secondary-container p-3 rounded-xl flex items-center justify-center shrink-0">
          <UserCheck size={24} className="text-secondary" />
        </div>
        <div>
          <h4 className="font-semibold text-on-surface text-base mb-1">
            Verified Community
          </h4>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Access a network of verified landlords and pre-screened quality tenants.
          </p>
        </div>
      </div>
    </section>
  );
}
