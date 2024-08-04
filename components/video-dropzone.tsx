"use client";

import React, { useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";

const baseStyle = {
	flex: 1,
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	padding: "20px",
	borderWidth: 2,
	borderRadius: 2,
	borderColor: "#eeeeee",
	borderStyle: "dashed",
	backgroundColor: "#fafafa",
	color: "#bdbdbd",
	outline: "none",
	transition: "border .24s ease-in-out",
};

const focusedStyle = {
	borderColor: "#2196f3",
};

const acceptStyle = {
	borderColor: "#00e676",
};

const rejectStyle = {
	borderColor: "#ff1744",
};

function VideoDropzone({ onUpload }: { onUpload: (fileName: string, buffer: any) => void }) {
	const onDrop = useCallback((acceptedFiles: any) => {
		// Do something with the files
		console.log("acceptedFiles", acceptedFiles);
		// get binary data
		const reader = new FileReader();
		const fileName = acceptedFiles[0].name;
		reader.onload = () => {
			const buffer = reader.result;
			console.log("buffer", buffer);
			onUpload(fileName, buffer as any);
		};
		reader.readAsArrayBuffer(acceptedFiles[0]);
	}, []);
	const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject, isDragActive } =
		useDropzone({ onDrop });

	const style = useMemo(
		() => ({
			...baseStyle,
			...(isFocused ? focusedStyle : {}),
			...(isDragAccept ? acceptStyle : {}),
			...(isDragReject ? rejectStyle : {}),
		}),
		[isFocused, isDragAccept, isDragReject],
	);

	return (
		<div className="container">
			<div {...getRootProps({ style: style as any })}>
				<input {...getInputProps()} />
				<p>Upload a video file here, only one file at a time is allowed</p>
			</div>
		</div>
	);
}

export default VideoDropzone;
