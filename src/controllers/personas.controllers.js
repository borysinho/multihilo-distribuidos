import axios from "axios";
import dotenv from "dotenv";
import axiosRetry from "axios-retry";

dotenv.config();

let personas;

axiosRetry(axios, {
  retries: -1,
  retryDelay: (retryCount) => {
    console.log(`reintentando por: ${retryCount}`);
    return retryCount + 500;
  },
});

const tieneDeudasLocal = () => {
  try {
    const count = personas.filter((obj) => obj.deudas === 1).length;

    //console.log("Personas con deuda: ", count);
  } catch (error) {
    if (error.response) {
      //El servidor respondió con un estado HTTP diferente
      console.error(
        "Error en la respuesta del servidor: ",
        error.response.status
      );
    } else if (error.request) {
      //la solicitud no pudo llegar al servidor o no recibió la respuesta
      console.error("Error en la solicitud al servidor:", error.message);
    } else {
      // otros errors
      console.error("Error:", error.message);
    }
  }
};

const getPersonas = () => {
  return personas;
};

const loadPersonas = async () => {
  try {
    const remoteURL =
      process.env.RS_PERSONAS || "192.168.1.1:3000/api/personas";

    const aux = (
      await axios.get(remoteURL, {
        params: { answer: 42 },
      })
    ).data;

    personas = aux.map((object) => {
      return { ...object, deudas: 1 };
    });

    return personas;
  } catch (error) {
    if (error.response) {
      //El servidor respondió con un estado HTTP diferente
      console.error(
        "Error en la respuesta del servidor: ",
        error.response.status
      );
    } else if (error.request) {
      //la solicitud no pudo llegar al servidor o no recibió la respuesta
      console.error("Error en la solicitud al servidor:", error.message);
    } else {
      // otros errors
      console.error("Error:", error.message);
    }
  }
};

export default { getPersonas, loadPersonas, tieneDeudasLocal };
