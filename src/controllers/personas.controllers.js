import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

let personas;

const tieneDeudasLocal = () => {
  try {
    const count = personas.filter((obj) => obj.deudas === 1).length;

    //console.log("Personas con deuda: ", count);
  } catch (error) {
    console.log("error", error);
  }
};

const getPersonas = () => {
  return personas;
};

const loadPersonas = async () => {
  try {
    const remoteURL =
      process.env.RS_PERSONAS || "http://localhost:3000/api/personas";

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
    console.log("Error", error);
  }
};

export default { getPersonas, loadPersonas, tieneDeudasLocal };
