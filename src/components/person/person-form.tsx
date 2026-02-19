'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { personSchema, PersonFormValues, defaultPersonFormValues } from '@/lib/validations/person-schema';
import { BasicInfoSection } from './form-section-basic';
import { VietnameseNamesSection } from './form-section-viet-names';
import { DatesSection } from './form-section-dates';
import { BiographySection } from './form-section-biography';
import { Person } from '@/types/person';
import { flexibleDateToInput } from '@/lib/utils/flexible-date-utils';

interface PersonFormProps {
  mode: 'create' | 'edit';
  initialData?: Person;
  onSubmit: (values: PersonFormValues) => Promise<void>;
  isSubmitting: boolean;
}

function personToFormValues(person: Person): PersonFormValues {
  return {
    ho: person.ho ?? '',
    ten_dem: person.ten_dem ?? '',
    ten: person.ten,
    gender: person.gender,
    branch_id: person.branch_id != null ? String(person.branch_id) : '',
    generation_number: person.generation_number != null ? String(person.generation_number) : '',
    ten_thuong_goi: person.ten_thuong_goi ?? '',
    ten_huy: person.ten_huy ?? '',
    ten_thuy: person.ten_thuy ?? '',
    ten_hieu: person.ten_hieu ?? '',
    han_nom_name: person.han_nom_name ?? '',
    is_deceased: !person.is_alive,
    birth_date: flexibleDateToInput(person.birth_date),
    birth_place: person.birth_place ?? '',
    death_date: flexibleDateToInput(person.death_date),
    death_place: person.death_place ?? '',
    biography: person.biography ?? '',
    notes: person.notes ?? '',
    address: person.address ?? '',
    phone: person.phone ?? '',
    email: person.email ?? '',
  };
}

export function PersonForm({ mode, initialData, onSubmit, isSubmitting }: PersonFormProps) {
  const form = useForm<PersonFormValues>({
    resolver: zodResolver(personSchema),
    defaultValues: initialData ? personToFormValues(initialData) : defaultPersonFormValues(),
  });

  const submitLabel = isSubmitting
    ? 'Đang lưu...'
    : mode === 'create'
      ? 'Tạo thành viên'
      : 'Lưu thông tin';

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Accordion
        type="multiple"
        defaultValue={['basic', 'viet-names', 'dates', 'biography']}
        className="w-full"
      >
        <BasicInfoSection form={form} />
        <VietnameseNamesSection form={form} />
        <DatesSection form={form} />
        <BiographySection form={form} />
      </Accordion>

      <div className="pt-4">
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
