import { PrismaClient } from "@prisma/client"
import { EXERCISE_CATALOG } from "../src/lib/exercises"

const prisma = new PrismaClient()

async function main() {
  const count = await prisma.exerciseType.count({ where: { isDefault: true, ownerId: null } })
  if (count > 0) {
    console.log(`種目カタログは既に ${count} 件あります。seed をスキップします。`)
    return
  }
  await prisma.exerciseType.createMany({
    data: EXERCISE_CATALOG.map((e) => ({
      name: e.name,
      category: e.category,
      metric: e.metric,
      sortOrder: e.sortOrder,
      isDefault: true,
    })),
  })
  console.log(`種目カタログ ${EXERCISE_CATALOG.length} 件を投入しました。`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
