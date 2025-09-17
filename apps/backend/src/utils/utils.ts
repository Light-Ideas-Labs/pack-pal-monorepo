const generateActivationCode = async (): Promise<string> => {
  const secretCode: string = Math.floor(100000 + Math.random() * 900000).toString();
  return secretCode;
};

export {
    generateActivationCode
}