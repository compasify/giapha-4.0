'use client';

import { UseFormReturn } from 'react-hook-form';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PersonFormValues } from '@/lib/validations/person-schema';

interface BasicInfoSectionProps {
  form: UseFormReturn<PersonFormValues>;
}

export function BasicInfoSection({ form }: BasicInfoSectionProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  return (
    <AccordionItem value="basic">
      <AccordionTrigger className="text-base font-semibold">Thông tin cơ bản</AccordionTrigger>
      <AccordionContent className="space-y-4 pt-2">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label htmlFor="ho">
              Họ <span className="text-destructive">*</span>
            </Label>
            <Input id="ho" {...register('ho')} placeholder="Nguyễn" />
            {errors.ho && <p className="text-xs text-destructive">{errors.ho.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="ten_dem">Tên đệm</Label>
            <Input id="ten_dem" {...register('ten_dem')} placeholder="Văn" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="ten">
              Tên <span className="text-destructive">*</span>
            </Label>
            <Input id="ten" {...register('ten')} placeholder="An" />
            {errors.ten && <p className="text-xs text-destructive">{errors.ten.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label>
              Giới tính <span className="text-destructive">*</span>
            </Label>
            <Select
              value={watch('gender')}
              onValueChange={(v) =>
                setValue('gender', v as PersonFormValues['gender'], { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn giới tính" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Nam</SelectItem>
                <SelectItem value="female">Nữ</SelectItem>
                <SelectItem value="other">Khác</SelectItem>
                <SelectItem value="unknown">Không rõ</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="text-xs text-destructive">{errors.gender.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="generation_number">Thế hệ</Label>
            <Input
              id="generation_number"
              type="number"
              {...register('generation_number')}
              placeholder="Số thế hệ"
              min={1}
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
