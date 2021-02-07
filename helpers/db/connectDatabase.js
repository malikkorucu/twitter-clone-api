const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      autoIndex: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("mongo db baglantısı başarılı");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDatabase;
