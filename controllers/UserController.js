const User = require("./../class/User");

module.exports.insert = async function(req, res, next) {
  const user = new User(
    req.body["email"],
    req.body["password"],
    req.body["maxTemp"],
    req.body["tempToSet"]
  );

  console.log(req.body["email"], req.body["password"]);
  try {
    await user.save();
  } catch (e) {
    switch (e.code) {
      case "ER_DUP_ENTRY":
        return res
          .status(500)
          .send({ message: "An account with this email already exists." });
        break;
      case "FAILED_HIVE_LOGIN":
        return res.status(500).send({
          message:
            "Hive login failed, please check your email and password. Also check that your hive thermostat is connected to this account. Please also check the status of the Hive api https://status.hivehome.com"
        });
        break;
      default:
        return res.status(500).send({
          message: "Sorry, an error occured. Please contact the admin."
        });
        break;
    }
  }

  res.status(200).send({ message: "Your settings have been saved" });
};

module.exports.delete = async function(req, res, next) {
  const user = new User(req.body["email"], req.body["password"]);
  try {
    const result = await user.delete();
    console.log(result);
    if (!result.affectedRows) throw { code: "NO_ACCOUNT_FOUND" };
  } catch (e) {
    switch (e.code) {
      case "NO_ACCOUNT_FOUND":
        return res.status(500).send({
          message:
            "Could not locate account. Please check your email and password.",
          error: e.code
        });
        break;

      default:
        return res.status(500).send({
          message: "Sorry, an error occured. Please contact the admin.",
          error: e.code
        });
        break;
    }
  }

  res.status(200).send({ message: "Your account has been deleted" });
};
