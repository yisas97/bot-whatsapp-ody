const ytSearch = require('yt-search');

async function searchYouTube(text) {
    text = text.replace("$yt.", "");
    try {
      const searchResults = await ytSearch(text);
  
      // Retornamos toda la información disponible de todos los resultados
      return searchResults.videos.length > 0 ? searchResults.videos[0] : null;
    } catch (error) {
      // En caso de que ocurra algún error, retornamos un array vacío o manejamos el error según lo requieras.
      console.error('Error al buscar en YouTube:', error);
      return [];
    }
}
  
module.exports = {
    searchYouTube,
};
  
  