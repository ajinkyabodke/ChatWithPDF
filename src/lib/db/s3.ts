import AWS from "aws-sdk";
require("dotenv").config(".env");

export async function uploadToS3(file: File) {
  try {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    });
    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.BUCKET_NAME,
      },
      region: "ap-south-1",
    });
    console.log(process.env.AWS_ACCESS_KEY);
    console.log(process.env.AWS_SECRET_KEY);
    console.log(process.env.BUCKET_NAME);
    const file_key =
      "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

    const params = {
      Bucket: process.env.BUCKET_NAME!, //! - to mention to system that it wont be null
      Key: file_key,
      Body: file,
    };

    const upload = s3
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        console.log(
          "Uploading to S3....",
          parseInt(((evt.loaded * 100) / evt.total).toString())
        );
        +"%";
      })
      .promise();

    await upload.then((data) => {
      console.log("successfully uploaded", file_key);
    });

    return Promise.resolve({
      file_key,
      file_name: file.name,
    });
  } catch (error) {
    console.log(error);
  }
}

export function getS3Url(file_key: string) {
  //utitility function to access the S3 URL from the file key itself
  const url = `https://${process.env.BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${file_key}`;
  return url;
}
