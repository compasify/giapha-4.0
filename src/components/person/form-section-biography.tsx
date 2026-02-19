'use client';

import { UseFormReturn } from 'react-hook-form';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PersonFormValues } from '@/lib/validations/person-schema';

interface BiographySectionProps {
  form: UseFormReturn<PersonFormValues>;
}

export function BiographySection({ form }: BiographySectionProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const biographyLength = watch('biography')?.length ?? 0;

  return (
    <AccordionItem value="biography">
      <AccordionTrigger className="text-base font-semibold">Tiểu sử</AccordionTrigger>
      <AccordionContent className="space-y-4 pt-2">
        <div className="space-y-1">
          <div className="flex justify-between">
            <Label htmlFor="biography">Tiểu sử</Label>
            <span className="text-xs text-muted-foreground">{biographyLength}/500</span>
          </div>
          <Textarea
            id="biography"
            {...register('biography')}
            placeholder="Ghi chép về cuộc đời, sự nghiệp..."
            rows={4}
            maxLength={500}
          />
          {errors.biography && (
            <p className="text-xs text-destructive">{errors.biography.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="notes">Ghi chú</Label>
          <Textarea
            id="notes"
            {...register('notes')}
            placeholder="Ghi chú thêm..."
            rows={2}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="address">Địa chỉ</Label>
          <Input id="address" {...register('address')} placeholder="Địa chỉ hiện tại hoặc quê quán" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="phone">Điện thoại</Label>
            <Input id="phone" {...register('phone')} placeholder="0912 345 678" type="tel" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" {...register('email')} placeholder="email@example.com" type="email" />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
