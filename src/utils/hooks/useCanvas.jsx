import { useEffect, useState } from "react";
import { fabric } from "fabric";
import { useSelector } from "react-redux";

const useCanvas = (containerRef, { image, template }) => {
  const isMobile = useSelector((state) => state.device.isMobile);

  const [finalCanvas, setFinalCanvas] = useState({
    canvasData: null,
    textChange: null,
    img: null,
  });
  const getImageFromUrl = (imageUrl) => {
    return new Promise((resolve, reject) => {
      if (imageUrl && containerRef.current) {
        fabric.Image.fromURL(
          imageUrl,
          function (img) {
            resolve(img);
          },
          { crossOrigin: "anonymous" }
        );
      } else {
        reject("nothing");
      }
    });
  };

  const bindEvent = (canvas) => {
    canvas.on("text:changed", function (option) {
      setFinalCanvas((pre) => {
        return {
          ...pre,
          textChange: { id: option.target.id, value: option.target.text },
        };
      });
    });
  };
  //width:350 or height:1000
  const calculateSize = (img) => {
    let ratio = 1;
    let isZoom = true;
    if (img.width >= img.height) {
      ratio = 300 / img.width;
    } else {
      if (img.height >= 1000) {
        ratio = 1000 / img.height;
        isZoom = false;
      } else {
        ratio = 300 / img.width;
      }
    }

    let canvasWidth = img.width * ratio;
    let canvasHeight = img.height * ratio;
    return { canvasWidth, canvasHeight, isZoom };
  };

  const resizeCanvasFromUrl = (img, canvas, ratio) => {
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
      scaleX: img.width / canvas.width,
      scaleY: img.height / canvas.height,
    });
    return canvas;
  };
  const resizeCanvasFromFile = () => {
    let img = new Image();
    img.src = image[0]?.["data_url"];

    img.onload = function () {
      var f_img = new fabric.Image(img);
      const { canvasWidth, canvasHeight, isZoom } = calculateSize(f_img);
      let canvas = initCanvas(canvasWidth, canvasHeight);
      canvas.setBackgroundImage(f_img, canvas.renderAll.bind(canvas), {
        scaleX: canvas.width / f_img.width,
        scaleY: canvas.height / f_img.height,
      });
      const ratio = isMobile ? 1 : 2;
      isZoom && zoomCanvas(ratio, canvas);
      setFinalCanvas({ ...finalCanvas, canvasData: canvas, img: f_img });
    };
  };

  const zoomCanvas = (zoomratio, canvas) => {
    canvas.setZoom(zoomratio);
    canvas.setWidth(canvas.width * zoomratio);
    canvas.setHeight(canvas.height * zoomratio);
  };

  const initCanvas = (canvasWidth, canvasHeight) => {
    let canvas = new fabric.Canvas("canvas", {
      width: canvasWidth,
      height: canvasHeight,
      imageSmoothingEnabled: false,
    });
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerStyle = "circle";

    bindEvent(canvas);
    return canvas;
  };

  const settingCanvas = async () => {
    if (!template && image) {
      containerRef.current && resizeCanvasFromFile();
    } else if (template && !image) {
      const img = await getImageFromUrl(template?.image);
      const { canvasWidth, canvasHeight, isZoom } = calculateSize(img);
      let canvas = initCanvas(canvasWidth, canvasHeight);
      canvas.loadFromJSON(template.default, canvas.renderAll.bind(canvas));
      canvas = resizeCanvasFromUrl(img, canvas);
      const ratio = isMobile ? 1 : 2;
      isZoom && zoomCanvas(ratio, canvas);
      canvas.renderAll();
      setFinalCanvas({
        ...finalCanvas,
        canvasData: canvas,
        img: img,
        isZoom: isZoom,
      });
    }
  };
  useEffect(() => {
    if (containerRef.current) settingCanvas();
  }, [template, image]);

  return {
    ...finalCanvas,
  };
};
export default useCanvas;
