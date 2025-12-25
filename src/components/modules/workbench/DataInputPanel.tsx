
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

type DataInputPanelProps = {
  value: string;
  onValueChange: (value: string) => void;
  isSample: boolean;
  setIsSample: (isSample: boolean) => void;
  onRemoveOutliers: () => void;
  outlierCount: number;
  validDataCount: number;
};

export function DataInputPanel({ 
    value, 
    onValueChange,
    isSample,
    setIsSample,
    onRemoveOutliers,
    outlierCount,
    validDataCount
}: DataInputPanelProps) {

  const handleSampleChange = (checked: boolean) => {
    setIsSample(checked);
  };

  return (
    <Card className="glassmorphism border-none">
      <CardHeader>
        <CardTitle>ورودی داده</CardTitle>
        <CardDescription>داده‌های خام و تنظیمات را اینجا وارد کنید.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="workbench-data-input">داده‌ها (جدا شده با کاما یا فاصله)</Label>
          <Textarea
            id="workbench-data-input"
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder="e.g., 18.5, 14, 17, 12, 19.5"
            rows={10}
            className="bg-slate-900/50 border-white/10 focus:border-purple-500 font-mono text-base"
          />
           <div className="text-xs text-slate-400 pt-1 text-left">
            داده‌های معتبر: <Badge variant="secondary">{validDataCount}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
