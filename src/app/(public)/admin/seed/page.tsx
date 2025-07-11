'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  IndustrialCard,
  IndustrialCardContent,
  IndustrialCardHeader,
  IndustrialCardTitle,
} from '@/components/ui/industrial-card';
import { IndustrialIcon } from '@/components/ui/industrial-icon';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Database,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

interface DatabaseStatus {
  manufacturers: number;
  machines: number;
  startups: number;
  gigs: number;
  isEmpty: boolean;
}

interface SeedResult {
  manufacturers: number;
  machines: number;
  startups: number;
  gigs: number;
}

export default function DatabaseSeedPage() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [result, setResult] = useState<SeedResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/seed');
      const data = await response.json();

      if (response.ok) {
        setStatus(data.data);
      } else {
        setError(data.error || 'Failed to fetch database status');
      }
    } catch (err) {
      setError('Error fetching database status');
      console.error('Error:', err);
    }
    setLoading(false);
  };

  const seedDatabase = async () => {
    setSeeding(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
      });
      const data = await response.json();

      if (response.ok) {
        setResult(data.data);
        await fetchStatus(); // Refresh status
      } else {
        setError(data.error || 'Failed to seed database');
      }
    } catch (err) {
      setError('Error seeding database');
      console.error('Error:', err);
    }
    setSeeding(false);
  };

  const clearDatabase = async () => {
    if (
      !confirm(
        'Are you sure you want to clear all data? This action cannot be undone.'
      )
    ) {
      return;
    }

    setClearing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/seed?confirm=true', {
        method: 'DELETE',
      });
      const data = await response.json();

      if (response.ok) {
        await fetchStatus(); // Refresh status
      } else {
        setError(data.error || 'Failed to clear database');
      }
    } catch (err) {
      setError('Error clearing database');
      console.error('Error:', err);
    }
    setClearing(false);
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="min-h-screen bg-industrial-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <IndustrialIcon
              icon="gear"
              size="lg"
              className="text-industrial-accent"
            />
            <h1 className="text-3xl font-bold text-industrial-foreground">
              Database Management
            </h1>
          </div>
          <p className="text-industrial-muted-foreground max-w-2xl mx-auto">
            Manage your WorkLink database by seeding it with sample data or
            clearing existing data. This tool is only available in development
            environment.
          </p>
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <IndustrialCard>
            <IndustrialCardHeader>
              <IndustrialCardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Current Database Status
              </IndustrialCardTitle>
            </IndustrialCardHeader>
            <IndustrialCardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-industrial-accent" />
                  <span className="ml-2">Loading status...</span>
                </div>
              ) : status ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-industrial-foreground">
                      {status.manufacturers}
                    </div>
                    <div className="text-sm text-industrial-muted-foreground">
                      Manufacturers
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-industrial-foreground">
                      {status.machines}
                    </div>
                    <div className="text-sm text-industrial-muted-foreground">
                      Machines
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-industrial-foreground">
                      {status.startups}
                    </div>
                    <div className="text-sm text-industrial-muted-foreground">
                      Startups
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-industrial-foreground">
                      {status.gigs}
                    </div>
                    <div className="text-sm text-industrial-muted-foreground">
                      Gigs
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-industrial-muted-foreground">
                  Failed to load database status
                </div>
              )}

              <div className="mt-4 flex justify-center">
                {status?.isEmpty ? (
                  <Badge variant="secondary" className="gap-2">
                    <AlertTriangle className="h-3 w-3" />
                    Database is empty
                  </Badge>
                ) : (
                  <Badge variant="default" className="gap-2">
                    <CheckCircle className="h-3 w-3" />
                    Database contains data
                  </Badge>
                )}
              </div>
            </IndustrialCardContent>
          </IndustrialCard>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Seed Database Card */}
          <IndustrialCard>
            <IndustrialCardHeader>
              <IndustrialCardTitle className="flex items-center gap-2">
                <IndustrialIcon icon="gear" size="sm" />
                Seed Database
              </IndustrialCardTitle>
            </IndustrialCardHeader>
            <IndustrialCardContent className="space-y-4">
              <p className="text-sm text-industrial-muted-foreground">
                Populate the database with sample manufacturers, machines,
                startups, and gigs. This will clear existing data first.
              </p>
              <ul className="text-xs text-industrial-muted-foreground space-y-1">
                <li>• 5 Manufacturers with their industrial facilities</li>
                <li>• 10 Different types of machines and equipment</li>
                <li>• 5 Startups from various sectors</li>
                <li>• 10 Job opportunities with diverse skill requirements</li>
              </ul>
              <Button
                onClick={seedDatabase}
                disabled={seeding || loading}
                className="w-full bg-industrial-accent hover:bg-industrial-accent/90"
              >
                {seeding ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Seeding Database...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Seed Database
                  </>
                )}
              </Button>
            </IndustrialCardContent>
          </IndustrialCard>

          {/* Clear Database Card */}
          <IndustrialCard>
            <IndustrialCardHeader>
              <IndustrialCardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-600" />
                Clear Database
              </IndustrialCardTitle>
            </IndustrialCardHeader>
            <IndustrialCardContent className="space-y-4">
              <p className="text-sm text-industrial-muted-foreground">
                Remove all data from the database. This action cannot be undone.
              </p>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800 text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  Warning: This will permanently delete all data
                </div>
              </div>
              <Button
                onClick={clearDatabase}
                disabled={clearing || loading}
                variant="destructive"
                className="w-full"
              >
                {clearing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Clearing Database...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Database
                  </>
                )}
              </Button>
            </IndustrialCardContent>
          </IndustrialCard>
        </motion.div>

        {/* Refresh Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <Button
            onClick={fetchStatus}
            disabled={loading}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Status
          </Button>
        </motion.div>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 text-green-800 font-medium mb-2">
              <CheckCircle className="h-5 w-5" />
              Database seeded successfully!
            </div>
            <div className="text-sm text-green-700 grid grid-cols-2 md:grid-cols-4 gap-2">
              <div>{result.manufacturers} Manufacturers</div>
              <div>{result.machines} Machines</div>
              <div>{result.startups} Startups</div>
              <div>{result.gigs} Gigs</div>
            </div>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 text-red-800 font-medium">
              <AlertTriangle className="h-5 w-5" />
              Error: {error}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
