const N = 300;
export const gData = [...Array(N).keys()].map(() => ({
  lat: (Math.random() - 0.5) * 180,
  lng: (Math.random() - 0.5) * 360,
  size: Math.random() / 3,
  color: ["red", "white", "blue", "green"][Math.round(Math.random() * 3)],
}));
