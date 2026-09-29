export const downloadImage = async (image) => {
    // if we don't have image url then return
    if (!image) return;

    const res = await fetch(image);
    console.log(res);

    const blob = await res.blob();
    console.log(blob);

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "download.jpg";

    document.body.appendChild(a);

    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
};