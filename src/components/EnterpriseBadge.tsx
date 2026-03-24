import React from 'react';
import { Crown } from 'lucide-react';
import { Badge } from './ui/badge';

interface EnterpriseBadgeProps {
  tier: 'premium' | 'enterprise';
  className?: string;
}

export function EnterpriseBadge({ tier, className }: EnterpriseBadgeProps) {
  const tierConfig = {
    premium: {
      text: 'Premium',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    },
    enterprise: {
      text: 'Enterprise',
      className: 'bg-blue-100 text-blue-800 border-blue-200',
    },
  };

  const config = tierConfig[tier];

  return (
    <Badge 
      variant="outline" 
      className={`inline-flex items-center px-2 py-1 text-xs rounded-full font-medium ${config.className} ${className || ''}`}
    >
      <Crown className="w-3 h-3 mr-1" />
      {config.text}
    </Badge>
  );
}