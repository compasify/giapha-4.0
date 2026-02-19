'use client';

import { UseFormReturn } from 'react-hook-form';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PersonFormValues } from '@/lib/validations/person-schema';

interface VietnameseNamesSectionProps {
  form: UseFormReturn<PersonFormValues>;
}

const VIET_NAME_FIELDS: { key: keyof PersonFormValues; label: string; placeholder: string }[] = [
  { key: 'ten_thuong_goi', label: 'Tên thường gọi', placeholder: 'Anh Hai, Chú Ba...' },
  { key: 'ten_huy', label: 'Tên huý', placeholder: 'Tên kị' },
  { key: 'ten_thuy', label: 'Tên thuỵ', placeholder: 'Tên sau khi mất' },
  { key: 'ten_hieu', label: 'Hiệu', placeholder: 'Bút danh, pháp hiệu...' },
  { key: 'han_nom_name', label: 'Tên Hán Nôm', placeholder: '阮文安' },
];

export function VietnameseNamesSection({ form }: VietnameseNamesSectionProps) {
  const { register } = form;

  return (
    <AccordionItem value="viet-names">
      <AccordionTrigger className="text-base font-semibold">Tên gọi Việt Nam</AccordionTrigger>
      <AccordionContent className="space-y-3 pt-2">
        {VIET_NAME_FIELDS.map((f) => (
          <div key={f.key} className="space-y-1">
            <Label htmlFor={f.key}>{f.label}</Label>
            <Input
              id={f.key}
              {...register(f.key as keyof PersonFormValues)}
              placeholder={f.placeholder}
            />
          </div>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}
