export const trimString = (str: string, start: number, end: number) => {
  if (!str || start < 0 || end < 0) return str;
  return Math.min(start + end, str.length) < str.length
    ? `${str.slice(0, start)}...${str.slice(-end)}`
    : str;
};

export const generateVerifyCode = () => {
  let verifyCode = '';
  for (let i = 0; i < 4; i++) {
    verifyCode += Math.floor(Math.random() * 10);
  }
  return verifyCode.toString();
};
