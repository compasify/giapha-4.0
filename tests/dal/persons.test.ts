// Test cho Persons Local DAL
import { describe, it, expect, beforeEach } from 'vitest'
import { personsLocalDal } from '@/lib/dal/local/persons-local-dal'
import { cleanDatabase, seedLineage, seedPerson } from '../helpers'

describe('personsLocalDal', () => {
    let lineageId: number

    beforeEach(async () => {
        await cleanDatabase()
        const lineage = await seedLineage('Lineage for Persons Test')
        lineageId = lineage.id
    })

    describe('list() / listByLineage()', () => {
        it('trả mảng rỗng khi chưa có person', async () => {
            const result = await personsLocalDal.listByLineage(lineageId)
            expect(result.data).toEqual([])
            expect(result.meta.total_entries).toBe(0)
        })

        it('trả danh sách với pagination meta', async () => {
            await seedPerson(lineageId, { ten: 'An' })
            await seedPerson(lineageId, { ten: 'Bình' })
            await seedPerson(lineageId, { ten: 'Cường' })

            const result = await personsLocalDal.listByLineage(lineageId, { per_page: 2, page: 1 })
            expect(result.data).toHaveLength(2)
            expect(result.meta.total_entries).toBe(3)
            expect(result.meta.total_pages).toBe(2)
            expect(result.meta.per_page).toBe(2)
        })

        it('page 2 trả đúng số lượng còn lại', async () => {
            await seedPerson(lineageId, { ten: 'An' })
            await seedPerson(lineageId, { ten: 'Bình' })
            await seedPerson(lineageId, { ten: 'Cường' })

            const result = await personsLocalDal.listByLineage(lineageId, { per_page: 2, page: 2 })
            expect(result.data).toHaveLength(1)
        })

        it('filter theo tên (Ransack-style name search)', async () => {
            await seedPerson(lineageId, { ten: 'An' })
            await seedPerson(lineageId, { ten: 'Bình' })

            const result = await personsLocalDal.listByLineage(lineageId, { name: 'An' })
            expect(result.data).toHaveLength(1)
            expect(result.data[0].ten).toBe('An')
        })

        it('filter theo gender', async () => {
            await seedPerson(lineageId, { ten: 'An', gender: 'male' })
            await seedPerson(lineageId, { ten: 'Bé', gender: 'female' })

            const result = await personsLocalDal.listByLineage(lineageId, { gender: 'female' })
            expect(result.data).toHaveLength(1)
            expect(result.data[0].ten).toBe('Bé')
        })
    })

    describe('get()', () => {
        it('trả person theo id', async () => {
            const created = await seedPerson(lineageId, { ten: 'Dũng' })
            const person = await personsLocalDal.get(created.id)

            expect(person.id).toBe(created.id)
            expect(person.ten).toBe('Dũng')
        })

        it('response shape đúng Person type', async () => {
            const created = await seedPerson(lineageId, {
                ho: 'Nguyễn',
                tenDem: 'Văn',
                ten: 'Em',
                gender: 'male',
                birthDateJson: JSON.stringify({ date_type: 'exact', day: 10, month: 5, year: 1990 }),
            })
            const person = await personsLocalDal.get(created.id)

            expect(person).toMatchObject({
                id: expect.any(Number),
                lineage_id: lineageId,
                ho: 'Nguyễn',
                ten_dem: 'Văn',
                ten: 'Em',
                full_name: 'Nguyễn Văn Em',
                gender: 'male',
                is_alive: true,
                birth_date: {
                    date_type: 'exact',
                    day: 10,
                    month: 5,
                    year: 1990,
                },
                death_date: null,
                created_at: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
                updated_at: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
            })
        })

        it('throw khi id không tồn tại', async () => {
            await expect(personsLocalDal.get(9999)).rejects.toThrow()
        })
    })

    describe('create()', () => {
        it('tạo person mới với FlexibleDate', async () => {
            const person = await personsLocalDal.create(lineageId, {
                ho: 'Trần',
                ten_dem: 'Thị',
                ten: 'Hoa',
                gender: 'female',
                birth_date_attributes: { date_type: 'exact', day: 20, month: 11, year: 1985 },
            })

            expect(person.ten).toBe('Hoa')
            expect(person.full_name).toBe('Trần Thị Hoa')
            expect(person.gender).toBe('female')
            expect(person.birth_date).toMatchObject({
                date_type: 'exact',
                day: 20,
                month: 11,
                year: 1985,
            })
        })

        it('tạo person không có birth_date', async () => {
            const person = await personsLocalDal.create(lineageId, {
                ten: 'Khôi',
                gender: 'male',
            })

            expect(person.ten).toBe('Khôi')
            expect(person.birth_date).toBeNull()
        })
    })

    describe('update()', () => {
        it('cập nhật tên person', async () => {
            const created = await seedPerson(lineageId, { ten: 'Tên Cũ' })
            const updated = await personsLocalDal.update(created.id, {
                ten: 'Tên Mới',
                gender: 'male',
            })

            expect(updated.ten).toBe('Tên Mới')
            expect(updated.id).toBe(created.id)
        })

        it('cập nhật birth_date', async () => {
            const created = await seedPerson(lineageId, { ten: 'Test' })
            const updated = await personsLocalDal.update(created.id, {
                ten: 'Test',
                gender: 'male',
                birth_date_attributes: { date_type: 'year_only', year: 2000 },
            })

            expect(updated.birth_date).toMatchObject({ date_type: 'year_only', year: 2000 })
        })
    })

    describe('delete()', () => {
        it('xóa person thành công', async () => {
            const created = await seedPerson(lineageId, { ten: 'Sẽ xóa' })
            await personsLocalDal.delete(created.id)

            await expect(personsLocalDal.get(created.id)).rejects.toThrow()
        })
    })
})
