export const downloadImage = async (image, id) => {
    if (!image) {
        throw new Error("An image URL is required to download an image.");
    }

    const response = await fetch(image);
    if (!response.ok) {
        throw new Error(`Image download failed with status ${response.status}.`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    const extension = blob.type.split("/")[1]?.split(";")[0] || "jpg";

    link.href = url;
    link.download = `generated-image-${id || "image"}.${extension}`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
};