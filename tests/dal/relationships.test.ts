// Test cho Relationships Local DAL
import { describe, it, expect, beforeEach } from 'vitest'
import { relationshipsLocalDal } from '@/lib/dal/local/relationships-local-dal'
import { cleanDatabase, seedLineage, seedPerson, seedRelationship } from '../helpers'

describe('relationshipsLocalDal', () => {
    let lineageId: number
    let personAId: number
    let personBId: number

    beforeEach(async () => {
        await cleanDatabase()
        const lineage = await seedLineage('Lineage for Relationships Test')
        lineageId = lineage.id
        const personA = await seedPerson(lineageId, { ten: 'Cha', generationNumber: 1 })
        const personB = await seedPerson(lineageId, { ten: 'Con', generationNumber: 2 })
        personAId = personA.id
        personBId = personB.id
    })

    describe('listByLineage()', () => {
        it('trả mảng rỗng khi chưa có relationship', async () => {
            const result = await relationshipsLocalDal.listByLineage(lineageId)
            expect(result.data).toEqual([])
            expect(result.meta.total_entries).toBe(0)
        })

        it('trả relationships kèm nested person data', async () => {
            await seedRelationship(personAId, personBId, 'parent_child')

            const result = await relationshipsLocalDal.listByLineage(lineageId)
            expect(result.data).toHaveLength(1)

            const rel = result.data[0]
            expect(rel.relationship_type).toBe('parent_child')
            expect(rel.from_person).toMatchObject({
                id: personAId,
                ten: 'Cha',
                full_name: expect.stringContaining('Cha'),
            })
            expect(rel.to_person).toMatchObject({
                id: personBId,
                ten: 'Con',
                full_name: expect.stringContaining('Con'),
            })
        })
    })

    describe('listByPerson()', () => {
        it('trả relationships liên quan đến 1 person', async () => {
            await seedRelationship(personAId, personBId, 'parent_child')

            const rels = await relationshipsLocalDal.listByPerson(personAId)
            expect(rels).toHaveLength(1)
            expect(rels[0].from_person.id).toBe(personAId)
        })

        it('tìm cả hai chiều (from + to)', async () => {
            await seedRelationship(personAId, personBId, 'parent_child')

            // Tìm từ phía con (toId = personBId)
            const rels = await relationshipsLocalDal.listByPerson(personBId)
            expect(rels).toHaveLength(1)
            expect(rels[0].to_person.id).toBe(personBId)
        })

        it('trả mảng rỗng khi person không có relationship', async () => {
            const rels = await relationshipsLocalDal.listByPerson(personAId)
            expect(rels).toEqual([])
        })
    })

    describe('create()', () => {
        it('tạo relationship mới', async () => {
            const rel = await relationshipsLocalDal.create({
                from_person_id: personAId,
                to_person_id: personBId,
                relationship_type: 'parent_child',
                notes: 'Con trai trưởng',
            })

            expect(rel.id).toBeGreaterThan(0)
            expect(rel.relationship_type).toBe('parent_child')
            expect(rel.notes).toBe('Con trai trưởng')
            expect(rel.from_person.id).toBe(personAId)
            expect(rel.to_person.id).toBe(personBId)
        })

        it('response shape đúng Relationship type', async () => {
            const rel = await relationshipsLocalDal.create({
                from_person_id: personAId,
                to_person_id: personBId,
                relationship_type: 'spouse',
            })

            expect(rel).toMatchObject({
                id: expect.any(Number),
                relationship_type: 'spouse',
                notes: null,
                from_person: expect.objectContaining({
                    id: expect.any(Number),
                    full_name: expect.any(String),
                    gender: expect.any(String),
                }),
                to_person: expect.objectContaining({
                    id: expect.any(Number),
                    full_name: expect.any(String),
                    gender: expect.any(String),
                }),
            })
        })
    })

    describe('delete()', () => {
        it('xóa relationship', async () => {
            const created = await seedRelationship(personAId, personBId)
            await relationshipsLocalDal.delete(created.id)

            const rels = await relationshipsLocalDal.listByPerson(personAId)
            expect(rels).toHaveLength(0)
        })

        it('throw khi xóa id không tồn tại', async () => {
            await expect(relationshipsLocalDal.delete(9999)).rejects.toThrow()
        })
    })
})
