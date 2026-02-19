'use client';

import { UseFormReturn } from 'react-hook-form';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FlexibleDatePicker } from '@/components/person/flexible-date-picker';
import { PersonFormValues } from '@/lib/validations/person-schema';

interface DatesSectionProps {
  form: UseFormReturn<PersonFormValues>;
}

export function DatesSection({ form }: DatesSectionProps) {
  const { register, control, watch, setValue } = form;
  const isDeceased = watch('is_deceased');

  return (
    <AccordionItem value="dates">
      <AccordionTrigger className="text-base font-semibold">Ngày tháng</AccordionTrigger>
      <AccordionContent className="space-y-5 pt-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id="is_deceased"
            checked={isDeceased}
            onCheckedChange={(checked) => setValue('is_deceased', Boolean(checked))}
          />
          <Label htmlFor="is_deceased" className="cursor-pointer">
            Đã mất
          </Label>
        </div>

        <FlexibleDatePicker label="Ngày sinh" fieldName="birth_date" control={control} />

        <div className="space-y-1">
          <Label htmlFor="birth_place">Nơi sinh</Label>
          <Input id="birth_place" {...register('birth_place')} placeholder="Tỉnh/thành phố, quốc gia" />
        </div>

        {isDeceased && (
          <>
            <FlexibleDatePicker label="Ngày mất" fieldName="death_date" control={control} />
            <div className="space-y-1">
              <Label htmlFor="death_place">Nơi mất</Label>
              <Input id="death_place" {...register('death_place')} placeholder="Tỉnh/thành phố, quốc gia" />
            </div>
          </>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
