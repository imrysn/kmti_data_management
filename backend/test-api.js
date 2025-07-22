const axios = require("axios");

const API_BASE = "http://localhost:5000/api";

async function testAPI() {
  try {
    console.log("Testing KMTI API...\n");

    // Test health endpoint
    console.log("1. Testing health endpoint...");
    const health = await axios.get(`${API_BASE}/health`);
    console.log("✅ Health check:", health.data);

    // Test login
    console.log("\n2. Testing login...");
    const login = await axios.post(`${API_BASE}/auth/login`, {
      username: "admin",
      password: "admin123",
    });
    console.log("✅ Login successful");

    const token = login.data.token;
    const headers = { Authorization: `Bearer ${token}` };

    // Test get current user
    console.log("\n3. Testing get current user...");
    const user = await axios.get(`${API_BASE}/auth/me`, { headers });
    console.log("✅ Current user:", user.data.user.username);

    // Test get files
    console.log("\n4. Testing get files...");
    const files = await axios.get(`${API_BASE}/files`, { headers });
    console.log("✅ Files loaded:", files.data.total || 0, "files");

    console.log("\n🎉 All API tests passed!");
  } catch (error) {
    console.error("❌ API test failed:", error.response?.data || error.message);
  }
}

testAPI();
