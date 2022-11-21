import axios from 'axios';

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

export const getRandomImage = async (): Promise<string> => {
  const link = `https://picsum.photos/id/${getRandomInt(0, 1000)}/info`;
  const {
    data: {url},
  } = await axios(link);
  return url;
};
