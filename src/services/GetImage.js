function getBase64Image(img) {
	var canvas = document.createElement("canvas");
	
	const maxSize = Math.max(img.width, img.height)
	const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2))
  
	// canvas.width = img.width;
	// canvas.height = img.height;

	canvas.width = safeArea;
	canvas.height = safeArea;
	
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0);
	return canvas.toDataURL("image/png");
}
export default getBase64Image;