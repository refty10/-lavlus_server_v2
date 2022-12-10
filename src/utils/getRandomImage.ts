import axios from 'axios';

interface PicsumData {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

export const getRandomImage = async (): Promise<string> => {
  const link = `https://picsum.photos/id/${getRandomInt(0, 1000)}/info`;
  const {data} = await axios.get<PicsumData>(link);
  return data.url;
};
