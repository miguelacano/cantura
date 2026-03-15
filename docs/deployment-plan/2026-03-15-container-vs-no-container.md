# Container Decision and Build Readiness

**Date:** 2026-03-15
**Context:** Cantura MVP, one-person team

## Decision: no container build yet

For the current phase, we will **not** add a container build step.

- Deployment strategy remains Vercel-first with managed PostgreSQL.
- Release velocity and reliability are improved first by hardening CI checks, migration safety, and environment management.
- Running without containers now keeps rollout simpler while the architecture is still a single Next.js service.

## When to move forward with containers

Use this rule as a checkpoint when deciding to introduce Docker:

> Start a container build only when at least one of the following is a real blocker in production delivery, and the benefit can be delivered without delaying core MVP scope.

1. **Custom runtime dependency requirement**
   - You need native tools or binaries that are not reliable on Vercel defaults.

2. **Background processing needs**
   - You introduce workers, queue consumers, or scheduled jobs as separate runtime responsibilities.

3. **Self-hosting requirement emerges**
   - You choose to run on Kubernetes, ECS, or Fly/VPS instead of platform hosting.

4. **Multi-service architecture appears**
   - You add adjacent services (worker, scheduler, media pipeline) that should be deployed together but scaled independently.

5. **Strict runtime-control requirement**
   - Security/compliance requires pinned OS/runtime layers and custom container hardening.

## Practical threshold (decision complete)

If any one of the above becomes a recurring issue for two consecutive release cycles, start container planning in that cycle.

## Suggested next step when ready

Once ready:

- Add `Dockerfile` + `.dockerignore`.
- Create a migration-aware startup flow (`DATABASE_URL`/`AUTH_SECRET` validation + Prisma migration behavior).
- Move deployment pipelines to build, push image, and environment-specific deploy steps.
- Add container health/readiness checks and deployment rollback checks using the image hash.
