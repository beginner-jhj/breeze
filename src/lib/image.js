import Bowser from "bowser";

const images = {
  pc: [
    {
      src: "https://images.pexels.com/photos/635279/pexels-photo-635279.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      src: "https://images.pexels.com/photos/1624255/pexels-photo-1624255.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      src: "https://images.pexels.com/photos/1668246/pexels-photo-1668246.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      src: "https://cdn.pixabay.com/photo/2022/09/21/21/13/mountains-7471189_1280.jpg",
    },
    {
      src: "https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      src: "https://images.pexels.com/photos/39811/pexels-photo-39811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      src: "https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      src: "https://images.pexels.com/photos/1417647/pexels-photo-1417647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      src: "https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
  ],
  mobile: [
    {
      src: "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      src: "https://images.pexels.com/photos/2486168/pexels-photo-2486168.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      src: "https://images.pexels.com/photos/1535162/pexels-photo-1535162.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      src: "https://images.pexels.com/photos/1257860/pexels-photo-1257860.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      src: "https://images.pexels.com/photos/40465/pexels-photo-40465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      src: "https://images.pexels.com/photos/1906794/pexels-photo-1906794.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      src: "https://images.pexels.com/photos/1591382/pexels-photo-1591382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      src: "https://images.pexels.com/photos/2760856/pexels-photo-2760856.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      src: "https://images.pexels.com/photos/1105189/pexels-photo-1105189.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
  ],
};

const parser = Bowser.getParser(window.navigator.userAgent);

export const getRandomImage = () => {
  const key = parser.getPlatformType() === "mobile" ? "mobile" : "pc";
  const index = Math.floor(Math.random() * 9);

  return images[key][index];
};

export const getImageList = () => {
  const key = parser.getPlatformType() === "mobile" ? "mobile" : "pc";
  return images[key];
};
