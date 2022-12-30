require("colors");
require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const cors = require("cors");
const port = process.env.port || 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(` Server is running on port ${port} `.bgBlue);
});

const uri = `mongodb+srv://TimeMate:Gdux3of4JSltQLM6@cluster0.4mqdriq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function dbConnect() {
  try {
    await client.connect();
    console.log("Database Connected ".bgMagenta);
  } catch (error) {
    console.log(error.message.bgRed);
  }
}
dbConnect();

const AllBookings = client.db("TimeMate").collection("AllBookings");
const AllEvents = client.db("TimeMate").collection("AllEvents");

app.post("/all-bookings", async (req, res) => {
  const bookingData = req.body;
  const result = await AllBookings.insertOne(bookingData);
  res.json({
    success: true,
    message: "Appointment Booked",
  });
});

app.get("/all-bookings", async (req, res) => {
  const result = await AllBookings.find({}).toArray();
  res.json({
    data: result,
  });
});

app.get("/my-bookings/:email", async (req, res) => {
  const email = req.params.email;
  const query = { email: email };
  const result = await AllBookings.find(query).toArray();
  res.send(result);
});

app.put("/all-bookings/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: ObjectId(id) };
  const optitons = { upsert: true };
  const updatedDoc = {
    $set: {
      status: true,
    },
  };
  const result = await AllBookings.updateOne(filter, updatedDoc, optitons);
  res.send({ success: true });
});

app.put("/all-bookings/update-date/:id", async (req, res) => {
  const id = req.params.id;
  const date = req.body.editedDate;
  const title = req.body.title;
  const filter = { _id: ObjectId(id) };
  const options = { upsert: true };
  const updatedDoc = {
    $set: {
      event: {
        date: date,
        title: title,
      },
    },
  };
  const result = await AllBookings.updateOne(filter, updatedDoc, options);
  res.send({ success: true });
});
