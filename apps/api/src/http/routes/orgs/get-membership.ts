import { ZodTypeProvider } from "fastify-type-provider-zod";
import { FastifyInstance } from "fastify";
import { roleSchema } from "@saas/auth";
import { z } from "zod";

import { auth } from "@/http/middlewares/auth";

export async function getMembership(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).get('/organization/:slug/membership', {
    schema: {
      tags: ['organizations'],
      security: [{ bearerAuth: [] }],
      summary: 'Get user membership on organization',
      params: z.object({
        slug: z.string()
      }),
      response: {
        200: z.object({
          membership: z.object({
            id: z.string().uuid(),
            role: roleSchema,
            organizationId: z.string().uuid()
          })
        })
      }
    }
  },
  async (request) => {
    const { slug } = request.params
    const { membership } = await request.getUserMembership(slug)

    return {
      membership: {
        id: membership.id,
        role: roleSchema.parse(membership.role),
        organizationId: membership.organizationId
      }
    }
  })
}