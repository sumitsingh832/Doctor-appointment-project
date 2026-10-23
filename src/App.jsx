
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "./App.css";

const COINS = ["bitcoin", "ethereum", "dogecoin"];

const fetchPrices = async () => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin&vs_currencies=usd"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch crypto prices");
  }

  return response.json();
};

// Simulate saving a favorite coin locally.
const saveFavorite = async (coin) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const saved = JSON.parse(localStorage.getItem("favorites") || "[]");

  if (!saved.includes(coin)) {
    localStorage.setItem(
      "favorites",
      JSON.stringify([...saved, coin])
    );
  }

  return coin;
};

const fetchFavorites = async () => {
  return JSON.parse(localStorage.getItem("favorites") || "[]");
};

function App() {
  const queryClient = useQueryClient();

  // Refetch prices every 10 seconds.
  const {
    data: prices,
    isPending,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["cryptoPrices"],
    queryFn: fetchPrices,
    refetchInterval: 10000,
  });

  // Load favorite coins.
  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: fetchFavorites,
  });

  // Save a favorite and refresh the favorites query.
  const favoriteMutation = useMutation({
    mutationFn: saveFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });

  if (isPending) {
    return (
      <main className="tracker-page">
        <section className="tracker-state" aria-live="polite">
          <span className="state-spinner" aria-hidden="true" />
          <h1>Loading crypto prices</h1>
          <p>Getting the latest market prices for you.</p>
        </section>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="tracker-page">
        <section className="tracker-state tracker-state--error" role="alert">
          <p className="eyebrow">PRICE UPDATE</p>
          <h1>Prices unavailable</h1>
          <p>{error.message}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="tracker-page">
      <div className="tracker-shell">
        <header className="tracker-header">
          <div>
            <p className="eyebrow">YOUR MARKET DASHBOARD</p>
            <h1>Crypto Price Tracker</h1>
            <p className="header-description">
              A clear view of the coins you’re keeping an eye on.
            </p>
          </div>
          <p className={`market-status${isFetching ? " is-updating" : ""}`}>
            <span className="status-dot" aria-hidden="true" />
            {isFetching ? "Updating prices" : "Prices are up to date"}
          </p>
        </header>

        <section className="coin-grid" aria-label="Cryptocurrency prices">
          {COINS.map((coin, index) => (
            <article className={`coin-card coin-card--${index + 1}`} key={coin}>
              <div className="coin-card-header">
                <span className="coin-mark" aria-hidden="true">
                  {coin.slice(0, 1).toUpperCase()}
                </span>
                <span className="coin-name">{coin}</span>
                <span className="coin-ticker">{coin.slice(0, 3).toUpperCase()}</span>
              </div>

              <p className="price-label">Current price</p>
              <p className="coin-price">
                <span className="currency-symbol">$</span>
                {prices[coin]?.usd?.toLocaleString() ?? "Unavailable"}
              </p>

              <button
                className={`favorite-button${favorites.includes(coin) ? " is-favorited" : ""}`}
                onClick={() => favoriteMutation.mutate(coin)}
                disabled={
                  favoriteMutation.isPending ||
                  favorites.includes(coin)
                }
              >
                <span aria-hidden="true">{favorites.includes(coin) ? "★" : "☆"}</span>
                {favorites.includes(coin)
                  ? "Favorited"
                  : favoriteMutation.isPending
                  ? "Saving..."
                  : "Add to favorites"}
              </button>
            </article>
          ))}
        </section>

        {favoriteMutation.isError && (
          <p className="favorite-error" role="alert">
            Could not save favorite. Please try again.
          </p>
        )}

        <section className="favorites-panel">
          <div>
            <p className="eyebrow">YOUR SHORTLIST</p>
            <h2>My Favorite Coins</h2>
          </div>
          {favorites.length === 0 ? (
            <p className="empty-favorites">
              No favorites yet. Add a coin to start your shortlist.
            </p>
          ) : (
            <ul className="favorite-list">
              {favorites.map((coin) => (
                <li key={coin}>
                  <span className="favorite-dot" aria-hidden="true" />
                  {coin.toUpperCase()}
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="tracker-footer">
          Prices refresh automatically every 10 seconds.
        </footer>
      </div>
    </main>
  );
}

export default App;
