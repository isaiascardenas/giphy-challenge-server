const axios = require("axios");
const { createGif } = require("./../api/gifs/gif.service");

const fecthGifs = async () => {
  return await axios
    .get(process.env.GIPHY_ENDPOINT + "/gifs/trending", {
      params: {
        api_key: process.env.GIPHY_API_KEY,
        limit: 50,
      },
    })
    .then((response) => response.data)
    .catch((err) => console.log("Error al conectarse a Giphy: ", err.message));
};

const populateGifs = async () => {
  const response = await fecthGifs();
  if (response.meta.status == 200) {
    console.log("-> Creando gifs desde Giphy ...");
    response.data.forEach((gif) => {
      if (gif.id) {
        try {
          createGif(
            {
              title: gif.title,
              giphy_id: gif.id,
              slug: gif.slug,
              url: gif.images.downsized_large.url,
            },
            (_) => {},
          );
        } catch (err) {
          console.log("Error al crear gif id: ", gif.id, err);
        }
      }
    });

    console.log("-> Gifs creados correctamente");
    console.log("-> Servidor listo!");
  }
};

module.exports = populateGifs;
