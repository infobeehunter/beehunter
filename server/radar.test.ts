import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    xpTotal: 0,
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

function createPublicContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("POI Router", () => {
  it("should list all POI when no category filter is provided", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.poi.list({});

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should filter POI by category", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.poi.list({ category: "Cultura" });

    expect(Array.isArray(result)).toBe(true);
    if (result.length > 0) {
      expect(result.every((poi: any) => poi.category === "Cultura")).toBe(true);
    }
  });

  it("should get POI by id", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // First get a list to find a valid ID
    const list = await caller.poi.list({});
    if (list.length > 0) {
      const firstPoi = list[0];
      const result = await caller.poi.detail({ id: firstPoi.id });

      expect(result).toBeDefined();
      expect(result.id).toBe(firstPoi.id);
      expect(result.name).toBe(firstPoi.name);
    }
  });

  it("should return NOT_FOUND error for invalid POI id", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.poi.detail({ id: 99999 });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("NOT_FOUND");
    }
  });

  it("should find nearby POI", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Bari center coordinates
    const result = await caller.poi.nearby({
      latitude: 41.1371,
      longitude: 16.8755,
      radiusKm: 5,
    });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("Badge Router", () => {
  it("should list all badges", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.badge.list();

    expect(Array.isArray(result)).toBe(true);
  });

  it("should require authentication to get user badges", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.badge.userBadges();
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });

  it("should get user badges when authenticated", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.badge.userBadges();

    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Leaderboard Router", () => {
  it("should get global leaderboard", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leaderboard.global({
      timeframe: "all",
      limit: 100,
    });

    expect(Array.isArray(result)).toBe(true);
  });
});

describe("User Router", () => {
  it("should require authentication to get profile", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.user.profile();
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });

  it("should get user profile when authenticated", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.user.profile();

    expect(result).toBeDefined();
    expect(result.id).toBe(ctx.user?.id);
    expect(result.xpTotal).toBeDefined();
    expect(result.badgeCount).toBeDefined();
  });

  it("should get user stats when authenticated", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.user.stats();

    expect(result).toBeDefined();
    expect(result.xpTotal).toBeDefined();
    expect(result.badgeCount).toBeDefined();
    expect(result.bookingCount).toBeDefined();
    expect(Array.isArray(result.xpHistory)).toBe(true);
  });
});
