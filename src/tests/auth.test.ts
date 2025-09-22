import request from "supertest";
import app from "../app";

describe("Auth API", () => {
  describe("POST /auth/start", () => {
    it("should return 400 if phone is missing", async () => {
      const response = await request(app).post("/auth/start").send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("phone required");
    });
  });

  describe("POST /auth/respond", () => {
    it("should return 400 if required fields are missing", async () => {
      const response = await request(app).post("/auth/respond").send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("phone, otp and session required");
    });
  });

  describe("GET /health", () => {
    it("should return health status", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
    });
  });
});
