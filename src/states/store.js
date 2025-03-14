import { create } from "zustand";

export const store = create((set, get) => ({
  openCongratModal: false,
  setOpenCongratModal: (val) => {
    if (typeof val === "function") {
      const callBack = val;
      const newValue = callBack(get().openCongratModal);
      set(() => ({ openCongratModal: newValue }));
    } else {
      set(() => ({ openCongratModal: val }));
    }
  },
  openDataModal: false,
  setOpenDataModal: (val) => {
    if (typeof val === "function") {
      const callBack = val;
      const newValue = callBack(get().openDataModal);
      // console.log(newValue);
      set(() => ({ openDataModal: newValue }));
    } else {
      set(() => ({ openDataModal: val }));
    }
  },
  bgSrc: "",
  setBgSrc: (src) => {
    set(() => ({ bgSrc: src }));
  },
}));
