import { z } from 'zod';
import { emptyFlexibleDateInput } from '@/lib/utils/flexible-date-utils';

const flexibleDateSchema = z.object({
  year: z.string().optional(),
  month: z
    .string()
    .optional()
    .refine(
      (v) => !v || (parseInt(v, 10) >= 1 && parseInt(v, 10) <= 12),
      'Tháng phải từ 1 đến 12'
    ),
  day: z
    .string()
    .optional()
    .refine(
      (v) => !v || (parseInt(v, 10) >= 1 && parseInt(v, 10) <= 31),
      'Ngày phải từ 1 đến 31'
    ),
  is_lunar: z.boolean(),
  date_qualifier: z.string(),
  date_note: z.string().optional(),
});

export const personSchema = z.object({
  ho: z.string().min(1, 'Vui lòng nhập họ'),
  ten_dem: z.string().optional(),
  ten: z.string().min(1, 'Vui lòng nhập tên'),
  gender: z.enum(['male', 'female', 'other', 'unknown'], {
    error: () => 'Vui lòng chọn giới tính',
  }),
  branch_id: z.string().optional(),
  generation_number: z.string().optional(),
  ten_thuong_goi: z.string().optional(),
  ten_huy: z.string().optional(),
  ten_thuy: z.string().optional(),
  ten_hieu: z.string().optional(),
  han_nom_name: z.string().optional(),
  is_deceased: z.boolean(),
  birth_date: flexibleDateSchema,
  birth_place: z.string().optional(),
  death_date: flexibleDateSchema,
  death_place: z.string().optional(),
  biography: z.string().max(500, 'Tiểu sử tối đa 500 ký tự').optional(),
  notes: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
});

export type PersonFormValues = z.infer<typeof personSchema>;

export function defaultPersonFormValues(): PersonFormValues {
  return {
    ho: '',
    ten_dem: '',
    ten: '',
    gender: 'unknown',
    branch_id: '',
    generation_number: '',
    ten_thuong_goi: '',
    ten_huy: '',
    ten_thuy: '',
    ten_hieu: '',
    han_nom_name: '',
    is_deceased: false,
    birth_date: emptyFlexibleDateInput(),
    birth_place: '',
    death_date: emptyFlexibleDateInput(),
    death_place: '',
    biography: '',
    notes: '',
    address: '',
    phone: '',
    email: '',
  };
}
