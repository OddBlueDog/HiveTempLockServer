const pool = require("./db");
const User = require("./class/User");

async function getAllTemps() {
  return await pool.query("SELECT email,password,maxTemp,tempToSet FROM users");
}

module.exports.loop = async function() {
  const allTemps = await getAllTemps();
  Object.keys(allTemps).forEach(async function(key) {
    try {
      const row = allTemps[key];
      const user = new User(row.email, row.password);
      await user.login();

      // If current target temp is above user specified max target temperature then set the temperature
      // to the temperature the user has specified as their default
      if (user.getCurrentTargetTemp() > row.maxTemp) {
        user.setTargetTemp(row.tempToSet);
      }

      console.log(
        `Current target temp ${user.getCurrentTargetTemp()} Desired max temp ${
          row.maxTemp
        } Temperature to set if above max ${row.tempToSet}`
      );
    } catch (e) {
      console.log("An issue occured");
    }
  });
};
