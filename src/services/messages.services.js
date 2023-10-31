const pagosRealizados = {};

const findHash = (hashID) => {
  return pagosRealizados[hashID];
};

const putHash = (hashID, value) => {
  pagosRealizados[hashID] = value;
};

export default { findHash, putHash };
