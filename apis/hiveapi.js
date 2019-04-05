const axios = require("axios");

const baseApi = axios.create({
  baseURL: "https://api-prod.bgchprod.info:443/omnia",
  headers: {
    "Content-Type": "application/vnd.alertme.zoo-6.1+json",
    Accept: "application/vnd.alertme.zoo-6.1+json",
    "X-Omnia-Client": "Hive Web Dashboard"
  }
});

module.exports.login = async function(username, password) {
  return await baseApi.post("/auth/sessions", {
    sessions: [
      {
        username: username,
        password: password,
        caller: "WEB"
      }
    ]
  });
};

module.exports.deviceList = async function(sessionId) {
  return await baseApi.get("/nodes", {
    headers: {
      "X-Omnia-Access-Token": sessionId
    }
  });
};

module.exports.setTargetTemp = async function(
  sessionId,
  deviceId,
  temperature
) {
  return await baseApi.put(
    `/nodes/${deviceId}`,
    {
      nodes: [
        {
          attributes: {
            targetHeatTemperature: {
              targetValue: temperature
            },
            activeScheduleLock: {
              targetValue: true
            },
            scheduleLockDuration: {
              targetValue: 0
            },
            activeHeatCoolMode: {
              targetValue: "HEAT"
            }
          }
        }
      ]
    },
    {
      headers: {
        "X-Omnia-Access-Token": sessionId
      }
    }
  );
};
