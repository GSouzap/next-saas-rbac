import { ZodTypeProvider } from "fastify-type-provider-zod";
import { projectSchema } from "@saas/auth";
import { FastifyInstance } from "fastify";
import { z } from "zod";

import { getUserPermissions } from "@/utils/get-user-permissions";
import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";

import { UnauthorizedError } from "../_errors/unauthorized-error";
import { BadRequestError } from "../_errors/bad-request-error";

export async function deleteProject(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).delete('/organizations/:slug/projects/:projectId', {
    schema: {
      tags: ['projects'],
      summary: 'Delete a project',
      security: [{ bearerAuth: [] }],
      params: z.object({
        slug: z.string(),
        projectId: z.string().uuid()
      }),
      response: {
        204: z.null()
      }
    }
  },
  async (request, reply) => {
    const { slug, projectId } = request.params
    const userId = await request.getCurrentUserId()
    const { membership, organization } = await request.getUserMembership(slug)

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        organizationId: organization.id
      }
    })

    if (!project) {
      throw new BadRequestError('Project not found')
    }

    const { cannot } = getUserPermissions(userId, membership.role)
    const authProject = projectSchema.parse(project)


    if (cannot('delete', authProject)) {
      throw new UnauthorizedError('You are not allowed to delete this projects.')
    }

    await prisma.project.delete({
      where: {
        id: projectId
      }
    })

    return reply.status(204).send()
  })  
}