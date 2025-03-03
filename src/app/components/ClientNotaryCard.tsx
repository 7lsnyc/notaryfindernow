'use client';

import NotaryCard from './NotaryCard';
import { Notary } from '@/lib/supabase';

interface ClientNotaryCardProps {
  notary: Notary;
}

export default function ClientNotaryCard({ notary }: ClientNotaryCardProps) {
  return <NotaryCard notary={notary} />;
} 