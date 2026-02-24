// Test cho Lineages Local DAL
import { describe, it, expect, beforeEach } from 'vitest'
import { lineagesLocalDal } from '@/lib/dal/local/lineages-local-dal'
import { cleanDatabase, seedLineage } from '../helpers'

describe('lineagesLocalDal', () => {
    beforeEach(async () => {
        await cleanDatabase()
    })

    describe('list()', () => {
        it('trả mảng rỗng khi chưa có dữ liệu', async () => {
            const lineages = await lineagesLocalDal.list()
            expect(lineages).toEqual([])
        })

        it('trả danh sách lineages đã tạo', async () => {
            await seedLineage('Họ Nguyễn')
            await seedLineage('Họ Trần')

            const lineages = await lineagesLocalDal.list()
            expect(lineages).toHaveLength(2)
            expect(lineages.map(l => l.name)).toContain('Họ Nguyễn')
            expect(lineages.map(l => l.name)).toContain('Họ Trần')
        })

        it('trả đúng shape Lineage type', async () => {
            await seedLineage('Họ Lê', 'Gia phả họ Lê')

            const [lineage] = await lineagesLocalDal.list()
            expect(lineage).toMatchObject({
                id: expect.any(Number),
                name: 'Họ Lê',
                description: 'Gia phả họ Lê',
                persons_count: 0,
                created_at: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
                updated_at: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
            })
        })
    })

    describe('get()', () => {
        it('trả lineage cụ thể theo id', async () => {
            const created = await seedLineage('Họ Phạm')

            const lineage = await lineagesLocalDal.get(created.id)
            expect(lineage.id).toBe(created.id)
            expect(lineage.name).toBe('Họ Phạm')
        })

        it('throw error khi id không tồn tại', async () => {
            await expect(lineagesLocalDal.get(9999)).rejects.toThrow()
        })
    })

    describe('create()', () => {
        it('tạo lineage mới và trả kết quả', async () => {
            const lineage = await lineagesLocalDal.create({
                name: 'Họ Vũ',
                description: 'Dòng họ Vũ',
            })

            expect(lineage.id).toBeGreaterThan(0)
            expect(lineage.name).toBe('Họ Vũ')
            expect(lineage.description).toBe('Dòng họ Vũ')
            expect(lineage.persons_count).toBe(0)
        })

        it('tạo lineage không có description', async () => {
            const lineage = await lineagesLocalDal.create({
                name: 'Họ Đặng',
            })

            expect(lineage.name).toBe('Họ Đặng')
            expect(lineage.description).toBeNull()
        })
    })

    describe('update()', () => {
        it('cập nhật tên lineage', async () => {
            const created = await seedLineage('Họ Ban Đầu')
            const updated = await lineagesLocalDal.update(created.id, { name: 'Họ Sau Update' })

            expect(updated.name).toBe('Họ Sau Update')
            expect(updated.id).toBe(created.id)
        })

        it('cập nhật description mà không đổi tên', async () => {
            const created = await seedLineage('Họ ABC', 'Mô tả cũ')
            const updated = await lineagesLocalDal.update(created.id, { description: 'Mô tả mới' })

            expect(updated.name).toBe('Họ ABC')
            expect(updated.description).toBe('Mô tả mới')
        })
    })

    describe('delete()', () => {
        it('xóa lineage thành công', async () => {
            const created = await seedLineage('Sẽ bị xóa')
            await lineagesLocalDal.delete(created.id)

            const lineages = await lineagesLocalDal.list()
            expect(lineages).toHaveLength(0)
        })

        it('throw error khi xóa id không tồn tại', async () => {
            await expect(lineagesLocalDal.delete(9999)).rejects.toThrow()
        })
    })
})
