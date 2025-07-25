'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Award,
  ShieldCheck,
  Users,
  Clock,
  BarChart2,
} from 'lucide-react';

const stats = [
  {
    value: '15,000+',
    label: 'Blue-Collar Workers',
    icon: Users,
    color: 'bg-industrial-navy-100 text-industrial-navy-600',
  },
  {
    value: '5,500+',
    label: 'Idle Machines Available',
    icon: BarChart2,
    color: 'bg-industrial-safety-100 text-industrial-safety-600',
  },
  {
    value: '850+',
    label: 'Active Gigs Posted',
    icon: CheckCircle2,
    color: 'bg-industrial-gunmetal-100 text-industrial-gunmetal-600',
  },
  {
    value: '2.5 hrs',
    label: 'Avg. Match Time',
    icon: Clock,
    color: 'bg-industrial-safety-200 text-industrial-safety-700',
  },
];

export function TrustIndicators() {
  return (
    <section className="py-20 bg-white" id="trust">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-oswald font-bold text-3xl md:text-4xl text-industrial-gunmetal-800 mb-4">
            Bridging the Industrial Gap
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Connecting skilled blue-collar workers with startups and unlocking
            idle manufacturing capacity. WorkLink transforms downtime into
            opportunity for everyone in the industrial ecosystem.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md border border-gray-100 p-6 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div
                  className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="font-oswald font-bold text-3xl text-industrial-gunmetal-800">
                  {stat.value}
                </div>
                <div className="text-gray-500 mt-1">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
