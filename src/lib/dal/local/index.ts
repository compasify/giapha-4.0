// Aggregate LocalDAL — implement DALInterface dùng Prisma (DATA_MODE=local)
import type { DALInterface } from '../types'
import { lineagesLocalDal } from './lineages-local-dal'
import { personsLocalDal } from './persons-local-dal'
import { relationshipsLocalDal } from './relationships-local-dal'
import { eventsLocalDal } from './events-local-dal'

export const localDal: DALInterface = {
    lineages: lineagesLocalDal,
    persons: personsLocalDal,
    relationships: relationshipsLocalDal,
    events: eventsLocalDal,
}
