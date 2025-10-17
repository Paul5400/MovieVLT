/**
 * Service de gestion des favoris
 * Gère l'ajout, suppression et récupération des films favoris en localStorage
 */

const FAVORITES_KEY = 'movieVLT_favorites';

/**
 * Récupère tous les favoris depuis localStorage
 * @returns {Array} Liste des films favoris
 */
export function getFavorites() {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris:', error);
    return [];
  }
}

/**
 * Sauvegarde les favoris en localStorage
 * @param {Array} favorites - Liste des films favoris
 */
function saveFavorites(favorites) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des favoris:', error);
  }
}

/**
 * Ajoute un item (film ou personne) aux favoris
 * @param {Object} item - Item à ajouter (doit contenir id et type: 'movie'|'person')
 * @returns {boolean} true si ajouté avec succès
 */
export function addToFavorites(item) {
  try {
    const favorites = getFavorites();

    // Normaliser le type
    const type = item.type || item.itemType || 'movie';
    const id = item.id;

    // Vérifier si l'item n'est pas déjà en favoris (comparaison par type+id)
    if (favorites.some(fav => fav.id === id && fav.type === type)) {
      return false; // Déjà en favoris
    }

    // Créer un objet simplifié pour ne garder que l'essentiel
    const favoriteItem = {
      id,
      type,
      title: item.title || item.name || item.Title || item.Name || '',
      poster_path: item.poster_path || item.poster || item.Poster || item.profile || item.Profile || null,
      release_date: item.release_date || item.Year || null,
      vote_average: item.vote_average || item.imdbRating || 0,
      overview: item.overview || item.Plot || '',
      addedAt: new Date().toISOString()
    };

    favorites.push(favoriteItem);
    saveFavorites(favorites);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'ajout aux favoris:', error);
    return false;
  }
}

/**
 * Retire un film des favoris
 * @param {number} movieId - ID du film à retirer
 * @returns {boolean} true si retiré avec succès
 */
export function removeFromFavorites(itemId, itemType = null) {
  try {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(fav => {
      if (itemType) return !(fav.id === itemId && fav.type === itemType);
      return fav.id !== itemId;
    });

    if (updatedFavorites.length !== favorites.length) {
      saveFavorites(updatedFavorites);
      return true;
    }
    return false; // Item pas trouvé dans les favoris
  } catch (error) {
    console.error('Erreur lors de la suppression des favoris:', error);
    return false;
  }
}

/**
 * Vérifie si un film est en favoris
 * @param {number} movieId - ID du film à vérifier
 * @returns {boolean} true si le film est en favoris
 */
export function isFavorite(itemId, itemType = null) {
  try {
    const favorites = getFavorites();
    if (itemType) return favorites.some(fav => fav.id === itemId && fav.type === itemType);
    return favorites.some(fav => fav.id === itemId);
  } catch (error) {
    console.error('Erreur lors de la vérification des favoris:', error);
    return false;
  }
}

/**
 * Bascule l'état favori d'un film
 * @param {Object} movie - Film concerné
 * @returns {boolean} true si ajouté, false si retiré
 */
export function toggleFavorite(item) {
  const type = item.type || item.itemType || 'movie';
  const id = item.id;
  if (isFavorite(id, type)) {
    removeFromFavorites(id, type);
    return false;
  } else {
    // garantir que l'objet contient le type
    const obj = { ...item, type };
    addToFavorites(obj);
    return true;
  }
}

/**
 * Compte le nombre de favoris
 * @returns {number} Nombre de films en favoris
 */
export function getFavoritesCount() {
  return getFavorites().length;
}

/**
 * Efface tous les favoris
 */
export function clearAllFavorites() {
  try {
    localStorage.removeItem(FAVORITES_KEY);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'effacement des favoris:', error);
    return false;
  }
}