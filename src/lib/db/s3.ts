import AWS from "aws-sdk";

export async function uploadToS3(file: File) {
  if (
    !process.env.NEXT_PUBLIC_AWS_ACCESS_KEY ||
    !process.env.NEXT_PUBLIC_AWS_SECRET_KEY ||
    !process.env.NEXT_PUBLIC_AWS_BUCKET_NAME
  ) {
    throw new Error("AWS credentials not set");
  }
  try {
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
    });
    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      },
      region: "ap-south-1",
    });

    const file_key =
      "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!, //! - to mention to system that it wont be null
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
  const url = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${file_key}`;
  return url;
}
