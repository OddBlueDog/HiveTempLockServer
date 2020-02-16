const hiveApi = require("../apis/hiveapi");
const pool = require("../db");

module.exports = class User {
  constructor(email, password, maxTemp = 21, tempToSet = 21) {
    this.email = email;
    this.password = password;
    this.maxTemp = maxTemp;
    this.tempToSet = tempToSet;
    this.sessionId = null;
    this.deviceList = null;
    this.failedHiveLogin = false;
  }

  async login() {
    try {
      const login = await hiveApi.login(this.email, this.password);
      this.sessionId = login.data.sessions[0].sessionId;
      this.deviceList = await this.getDeviceList();
      this.thermostats = await this.getThermostats();
    } catch (e) {
      this.failedHiveLogin = true;
    }
  }

  async getDeviceList() {
    return (await hiveApi.deviceList(this.sessionId)).data.nodes;
  }

  async getThermostats() {
    const themostat = this.deviceList.filter(function(node) {
      return (
        node.name.match(/Thermostat *(.+)*/g) && node.attributes.temperature
      );
    });

    return themostat;
  }

  async setTargetTemp(temperature, thermostatId) {
    return hiveApi.setTargetTemp(
      this.sessionId,
      thermostatId,
      temperature
    );
  }

  async getTemperatureSettings() {
    return await pool.query("SELECT * FROM users");
  }

  async save() {
    // Check if hive details are valid for login before adding to database
    await this.login();
    if (this.failedHiveLogin) throw { code: "FAILED_HIVE_LOGIN" };

    const data = [this.email, this.password, this.maxTemp, this.tempToSet];

    const preparedInsertQuery =
      "INSERT INTO users(email,password,maxTemp,tempToSet) VALUES (?,?,?,?)";

    return await pool.query(preparedInsertQuery, data);
  }

  async delete() {
    const preparedDeleteQuery =
      "DELETE FROM users WHERE email = ? AND password = ?";
    const data = [this.email, this.password];

    return await pool.query(preparedDeleteQuery, data);
  }

  getThermostatId(thermostat) {
    return thermostat.id;
  }
  
  getCurrentTargetTemp(thermostat) {
    return thermostat.attributes.targetHeatTemperature.targetValue;
  }
  
  getCurrentReportedValue(thermostat) {
    return thermostat.attributes.targetHeatTemperature.reportedValue;
  }
};
