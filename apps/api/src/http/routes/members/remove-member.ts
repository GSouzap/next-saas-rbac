import { ZodTypeProvider } from "fastify-type-provider-zod";
import { FastifyInstance } from "fastify";
import { roleSchema } from "@saas/auth";
import { z } from "zod";

import { getUserPermissions } from "@/utils/get-user-permissions";
import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";

import { UnauthorizedError } from "../_errors/unauthorized-error";

export async function removeMember(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).delete('/organizations/:slug/members/:memberId', {
    schema: {
      tags: ['members'],
      summary: 'Remove a member from the organization',
      security: [{ bearerAuth: [] }],
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

    if (cannot('delete', 'User')) {
      throw new UnauthorizedError('You are not allowed to remove this member from the organization.')
    }

    await prisma.member.delete({
      where: {
        id: memberId,
        organizationId: organization.id
      }
    })

    return reply.status(204).send()
  })  
}