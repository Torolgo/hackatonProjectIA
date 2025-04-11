package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
)

// Article représente un article du blog
type Article struct {
	ID      int    `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
	Author  string `json:"author"`
	Date    string `json:"date"`
	Image   string `json:"image"`
}

// EcoFact représente un fait écologique pour le jeu
type EcoFact struct {
	ID      int    `json:"id"`
	Content string `json:"content"`
}

var articles = []Article{
	{ID: 1, Title: "Ton dressing, ton impact", Content: "Découvrez les gestes simples qui peuvent avoir un impact significatif sur votre empreinte écologique...", Author: "Marie Dupont", Date: "12 mai 2023", Image: "images/blog1.jpg"},
	{ID: 2, Title: "Les bénéfices écologiques du compostage", Content: "Le compostage est une solution simple et efficace pour réduire ses déchets et enrichir son jardin...", Author: "Thomas Martin", Date: "28 avril 2023", Image: "images/blog2.jpg"},
	{ID: 3, Title: "Comprendre l'impact environnemental de notre alimentation", Content: "Notre alimentation est responsable d'une part importante de notre empreinte écologique. Voici comment agir...", Author: "Sophie Laurent", Date: "15 avril 2023", Image: "images/blog3.jpg"},
	{ID: 4, Title: "Les énergies renouvelables : état des lieux et perspectives", Content: "Où en est-on dans la transition énergétique ? Quelles sont les technologies les plus prometteuses ?", Author: "Lucas Blanc", Date: "2 avril 2023", Image: "images/blog4.jpg"},
}

var ecoFacts = []EcoFact{
	{ID: 1, Content: "Le recyclage d'une tonne de papier permet de sauver 17 arbres et d'économiser 20 000 litres d'eau !"},
	{ID: 2, Content: "Une bouteille en plastique peut mettre jusqu'à 1000 ans pour se décomposer dans la nature."},
	{ID: 3, Content: "Chaque année, 8 millions de tonnes de plastique finissent dans les océans."},
	{ID: 4, Content: "Le verre peut être recyclé à l'infini sans perdre en qualité."},
	{ID: 5, Content: "Un téléphone portable contient plus de 60 matériaux différents qui pourraient être recyclés."},
	{ID: 6, Content: "Recycler une canette en aluminium économise assez d'énergie pour faire fonctionner une télévision pendant 3 heures."},
	{ID: 7, Content: "Près de 80% de ce qui se trouve dans nos poubelles pourrait être recyclé ou composté."},
	{ID: 8, Content: "Un chargeur de téléphone branché sans être utilisé continue de consommer de l'électricité."},
	{ID: 9, Content: "Le compostage des déchets organiques réduit la quantité de méthane produit par les décharges."},
	{ID: 10, Content: "Une pile jetée dans la nature peut polluer 1m³ de terre et 1000m³ d'eau pendant 50 ans."},
}

func main() {
	// Configuration du port (utilise la variable d'environnement PORT ou 8080 par défaut)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Servir les fichiers statiques
	fs := http.FileServer(http.Dir("./"))
	http.Handle("/", corsMiddleware(fs))

	// API endpoints
	http.HandleFunc("/api/articles", handlerArticles)
	http.HandleFunc("/api/article/", handlerArticle)
	http.HandleFunc("/api/ecofacts", handlerEcoFacts)
	http.HandleFunc("/api/ecofact/", handlerEcoFact)

	// Lancement du serveur
	log.Printf("Serveur démarré sur le port %s\n", port)
	log.Printf("Accédez à http://localhost:%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

// Middleware pour gérer les requêtes CORS
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Gestion des CORS
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// Pour les requêtes OPTIONS, renvoyer seulement les headers
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Gère les répertoires racine automatiquement avec l'index.html
		if r.URL.Path == "/" {
			http.ServeFile(w, r, "./index.html")
			return
		}

		// Pour tout autre chemin, essaie d'abord de servir le fichier directement
		path := filepath.Join("./", r.URL.Path)
		_, err := os.Stat(path)
		if os.IsNotExist(err) {
			// Si le fichier n'existe pas, essaie de voir si c'est une route nécessitant index.html
			ext := filepath.Ext(path)
			if ext == "" {
				// Retour à index.html pour que le routage frontend prenne le relais
				http.ServeFile(w, r, "./index.html")
				return
			}
		}

		// Sinon, servir normalement
		next.ServeHTTP(w, r)
	})
}

// Gestionnaire pour tous les articles
func handlerArticles(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(articles)
}

// Gestionnaire pour un article spécifique
func handlerArticle(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Extraire l'ID de l'article depuis l'URL
	idStr := r.URL.Path[len("/api/article/"):]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "ID d'article invalide", http.StatusBadRequest)
		return
	}

	// Rechercher l'article par ID
	for _, article := range articles {
		if article.ID == id {
			json.NewEncoder(w).Encode(article)
			return
		}
	}

	// Article non trouvé
	http.Error(w, "Article non trouvé", http.StatusNotFound)
}

// Gestionnaire pour tous les faits écologiques
func handlerEcoFacts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ecoFacts)
}

// Gestionnaire pour un fait écologique spécifique
func handlerEcoFact(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Extraire l'ID du fait depuis l'URL
	idStr := r.URL.Path[len("/api/ecofact/"):]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "ID de fait écologique invalide", http.StatusBadRequest)
		return
	}

	// Rechercher le fait par ID
	for _, fact := range ecoFacts {
		if fact.ID == id {
			json.NewEncoder(w).Encode(fact)
			return
		}
	}

	// Fait non trouvé
	http.Error(w, "Fait écologique non trouvé", http.StatusNotFound)
}
