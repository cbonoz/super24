import axios from "axios";

export const THETA_KEY = process.env.NEXT_PUBLIC_THETA_KEY;

// https://docs.thetatoken.org/docs/theta-video-api-developer-api

export const thetaUpload = async (fileName: string, data: any) => {
	console.log("thetaUpload", fileName, data);
	const res = await axios({
		method: "POST",
		url: "https://api.thetavideoapi.com/upload",
		headers: {
			"x-tva-sa-id": process.env.NEXT_PUBLIC_THETA_KEY,
			"x-tva-sa-secret": process.env.NEXT_PUBLIC_THETA_SECRET,
		},
	});

	const url = res.data.body.uploads[0].presigned_url;

	const uploadRes = await axios({
		method: "PUT",
		url,
		headers: {
			"Content-Type": "application/octet-stream",
		},
		data,
	});

	console.log("uploadRes", uploadRes);
	return { url, uploadRes };
};
