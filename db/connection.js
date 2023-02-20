/** @format */

// Import the mongoose module
const mongoose = require("mongoose");

// Set `strictQuery: false` to globally opt into filtering by properties that aren't in the schema
// Included because it removes preparatory warnings for Mongoose 7.
// See: https://mongoosejs.com/docs/migrating_to_6.html#strictquery-is-removed-and-replaced-by-strict
mongoose.set("strictQuery", false);

// Define the database URL to connect to.
// const mongoDB = "mongodb://127.0.0.1/Assignment_elred";
const mongoDB =
  "mongodb+srv://shahneel1562:mq9I3mwm76mNRgQx@cluster0.ascni7z.mongodb.net/?retryWrites=true&w=majority";

// Wait for database to connect, logging an error if there is a problem
main()
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => console.log(err));
async function main() {
  return await mongoose.connect(
    "mongodb+srv://shahneel1562:mq9I3mwm76mNRgQx@cluster0.ascni7z.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
}
