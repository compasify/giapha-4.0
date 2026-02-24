// Test cho Events Local DAL
import { describe, it, expect, beforeEach } from 'vitest'
import { eventsLocalDal } from '@/lib/dal/local/events-local-dal'
import { cleanDatabase, seedLineage, seedEvent } from '../helpers'

describe('eventsLocalDal', () => {
    let lineageId: number

    beforeEach(async () => {
        await cleanDatabase()
        const lineage = await seedLineage('Lineage for Events Test')
        lineageId = lineage.id
    })

    describe('list()', () => {
        it('trả mảng rỗng khi chưa có event', async () => {
            const result = await eventsLocalDal.list({ lineageId })
            expect(result.data).toEqual([])
            expect(result.meta.total_entries).toBe(0)
        })

        it('trả danh sách events với pagination', async () => {
            await seedEvent(lineageId, { title: 'Giỗ tổ' })
            await seedEvent(lineageId, { title: 'Họp mặt' })
            await seedEvent(lineageId, { title: 'Lễ thanh minh' })

            const result = await eventsLocalDal.list({ lineageId, per_page: 2, page: 1 })
            expect(result.data).toHaveLength(2)
            expect(result.meta.total_entries).toBe(3)
            expect(result.meta.total_pages).toBe(2)
        })

        it('trả GenealogyEventSummary shape (không phải full)', async () => {
            await seedEvent(lineageId, { title: 'Event Test', eventType: 'memorial' })

            const result = await eventsLocalDal.list({ lineageId })
            const event = result.data[0]

            expect(event).toMatchObject({
                id: expect.any(Number),
                title: 'Event Test',
                event_type: 'memorial',
                created_at: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
            })
            // Summary không nên có updated_at, lineage_id
            expect(event).not.toHaveProperty('updated_at')
            expect(event).not.toHaveProperty('lineage_id')
        })
    })

    describe('get()', () => {
        it('trả full GenealogyEvent shape', async () => {
            const created = await seedEvent(lineageId, { title: 'Chi Tiết' })
            const event = await eventsLocalDal.get(created.id)

            expect(event).toMatchObject({
                id: created.id,
                title: 'Chi Tiết',
                event_type: 'anniversary',
                lineage_id: lineageId,
                is_recurring: false,
                participants: [],
                flexible_dates: [],
                created_at: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
                updated_at: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
            })
        })

        it('throw khi id không tồn tại', async () => {
            await expect(eventsLocalDal.get(9999)).rejects.toThrow()
        })
    })

    describe('create()', () => {
        it('tạo event mới', async () => {
            const event = await eventsLocalDal.create(lineageId, {
                title: 'Tết Nguyên Đán',
                event_type: 'holiday' as never,
                description: 'Họp mặt đầu năm',
                location: 'Hà Nội',
            })

            expect(event.id).toBeGreaterThan(0)
            expect(event.title).toBe('Tết Nguyên Đán')
            expect(event.location).toBe('Hà Nội')
            expect(event.lineage_id).toBe(lineageId)
        })
    })

    describe('update()', () => {
        it('cập nhật event', async () => {
            const created = await seedEvent(lineageId, { title: 'Tiêu đề cũ' })
            const updated = await eventsLocalDal.update(created.id, {
                title: 'Tiêu đề mới',
                location: 'TP. Hồ Chí Minh',
            })

            expect(updated.title).toBe('Tiêu đề mới')
            expect(updated.location).toBe('TP. Hồ Chí Minh')
        })
    })

    describe('delete()', () => {
        it('xóa event thành công', async () => {
            const created = await seedEvent(lineageId, { title: 'Sẽ xóa' })
            await eventsLocalDal.delete(created.id)

            await expect(eventsLocalDal.get(created.id)).rejects.toThrow()
        })
    })
})
