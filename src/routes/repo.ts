import { Router } from "express";
import { fetchResponse } from "../github.service";
import { PrismaClient } from "../generated/prisma";

const router = Router()
const prisma = new PrismaClient()

router.post("/sync/:org", async (req, res) => {
  const org = req.params.org

  try {
    const repos = await fetchResponse(org)

    const result = await Promise.allSettled(
      repos.map(repo => 
        prisma.repository.upsert({
          where: { githubId: repo.id },
          update: { stars: repo.stargazers_count },
          create: {
            githubId: repo.id,
            name: repo.name,
            description: repo.description,
            stars: repo.stargazers_count,
            url: repo.html_url,
      }
        }
    ))
    )

    const successCount = result.filter(r => r.status === "fulfilled").length;
    res.json({message: `Synced ${successCount} repos for ${org}`})
  } catch (error) {
    res.status(500).json({message: `Failed to sync repos`, details: error})
  }
})

router.get("/top", async (req, res) => {
  const top = await prisma.repository.findMany({
    orderBy: {stars: "desc"},
    take: 5
  })

  res.json(top)
})

export default router