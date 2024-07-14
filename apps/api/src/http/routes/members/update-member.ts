import { ZodTypeProvider } from "fastify-type-provider-zod";
import { FastifyInstance } from "fastify";
import { roleSchema } from "@saas/auth";
import { z } from "zod";

import { getUserPermissions } from "@/utils/get-user-permissions";
import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";

import { UnauthorizedError } from "../_errors/unauthorized-error";

export async function updateMember(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).put('/organizations/:slug/members/:memberId', {
    schema: {
      tags: ['members'],
      summary: 'Update a member',
      security: [{ bearerAuth: [] }],
      body: z.object({
        role: roleSchema
      }),
      params: z.object({
        slug: z.string(),
        memberId: z.string()
      }),
      response: {
        204: z.null()
      }
    }
  },
  async (request, reply) => {
    const { slug, memberId } = request.params
    const userId = await request.getCurrentUserId()
    const { membership, organization } = await request.getUserMembership(slug)

    const { cannot } = getUserPermissions(userId, membership.role)

    if (cannot('update', 'User')) {
      throw new UnauthorizedError('You are not allowed to update this member.')
    }

    const { role } = request.body

    await prisma.member.update({
      where: {
        id: memberId,
        organizationId: organization.id
      },
      data: {
        role
      }
    })

    return reply.status(204).send()
  })  
}