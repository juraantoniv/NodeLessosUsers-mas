import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/images");
  },
  filename: async function (req, file, cb) {
    try {
      cb(
        null,
        new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname,
      );
    } catch (e) {}
  },
});
export const upload = multer({ storage: storage });
