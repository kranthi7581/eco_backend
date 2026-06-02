const { User } = require("./models/relations");
const { connectDB } = require("./config/db");

async function run() {
  try {
    await connectDB();
    console.log("DB connected");
    const users = await User.findAll();
    console.log("Users in DB:", users.map(u => ({ id: u.id, username: u.username, email: u.email, role: u.role })));
  } catch (err) {
    console.error("Query failed with error:");
    console.error(err);
  } finally {
    process.exit();
  }
}

run();
