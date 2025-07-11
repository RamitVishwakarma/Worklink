'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { IndustrialButton as Button } from '@/components/ui/industrial-button';
import { Trash2, AlertTriangle, Loader } from 'lucide-react';
import { Gig } from '@/lib/types';

interface DeleteGigModalProps {
  isOpen: boolean;
  onClose: () => void;
  gig: Gig | null;
  onConfirm: (gigId: string) => Promise<boolean>;
  isLoading?: boolean;
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

export function DeleteGigModal({
  isOpen,
  onClose,
  gig,
  onConfirm,
  isLoading = false,
}: DeleteGigModalProps) {
  const handleConfirm = async () => {
    if (!gig) return;

    const success = await onConfirm(gig._id);
    if (success) {
      onClose();
    }
  };

  if (!gig) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Gig
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Are you sure you want to delete the gig{' '}
                <span className="font-semibold">"{gig.title}"</span>?
              </p>
              <p className="text-sm text-gray-500">
                This action cannot be undone. All applications for this gig will
                also be removed.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-2">
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <Button
              variant="industrial-danger"
              onClick={handleConfirm}
              disabled={isLoading}
            >
              <div className="flex items-center justify-center">
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Gig
                  </>
                )}
              </div>
            </Button>
          </AlertDialogFooter>
        </motion.div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
