import React, { useEffect, useState, useCallback } from "react";
import { getDocs, query, orderBy, Timestamp, onSnapshot } from "firebase/firestore";
import { itemsCollection } from "./firebase";
import type { Post, SortOption } from "./types";
import { Card } from "./components/Card";
import { PostModal } from "./components/PostModal";
import { HelpModal } from "./components/HelpModal";

type ThemeOption = "default" | "theme-cyber" | "theme-darkroom";

export const App: React.FC = () => {
  const [rawPosts, setRawPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortMode, setSortMode] = useState<SortOption>("newest");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const [theme, setTheme] = useState<ThemeOption>(
    () => (localStorage.getItem("cork_theme") as ThemeOption) || "default"
  );

  useEffect(() => {
    document.body.classList.remove("theme-cyber", "theme-darkroom");
    if (theme !== "default") {
      document.body.classList.add(theme);
    }
    localStorage.setItem("cork_theme", theme);
  }, [theme]);

  const fetchPosts = useCallback(async () => {
    const q = query(itemsCollection, orderBy("timestamp", "desc"));
    try {
      const querySnapshot = await getDocs(q);
      const posts: Post[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Post, "id">),
      }));
      setRawPosts(posts);
    } catch (error) {
      console.error("Error loading posts from Firebase: ", error);
    }
  }, []);

  useEffect(() => {
    const q = query(itemsCollection, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const posts: Post[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Post, "id">),
        }));
        setRawPosts(posts);
      },
      (error) => {
        console.error("Error loading posts from Firebase: ", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const getSeconds = (ts?: Timestamp | Date): number => {
    if (!ts) return 0;
    if (ts instanceof Timestamp) return ts.seconds;
    if (ts instanceof Date) return Math.floor(ts.getTime() / 1000);
    return 0;
  };

  const filteredPosts = rawPosts
    .filter((item) => {
      const term = searchTerm.toLowerCase().trim();
      return (
        (item.title || "").toLowerCase().includes(term) ||
        (item.description || "").toLowerCase().includes(term) ||
        (item.seller || "").toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      if (sortMode === "oldest") {
        return getSeconds(a.timestamp) - getSeconds(b.timestamp);
      } else if (sortMode === "title") {
        return (a.title || "").localeCompare(b.title || "");
      }
      return getSeconds(b.timestamp) - getSeconds(a.timestamp);
    });

  return (
    <>
      <h1>Cork</h1>

      <div className="top-bar" role="search">
        <label htmlFor="search-input" className="sr-only">
          Search items or sellers...
        </label>
        <input
          id="search-input"
          type="text"
          placeholder="Search items or sellers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <label htmlFor="sort-select" className="sr-only">
          Sort items
        </label>
        <select
          id="sort-select"
          value={sortMode}
          onChange={(e) => setSortMode(e.target.value as SortOption)}
        >
          <option value="newest">Sort by: Newest</option>
          <option value="oldest">Sort by: Oldest</option>
          <option value="title">Sort by: Name (A-Z)</option>
        </select>

        <label htmlFor="theme-select" className="sr-only">
          Select theme
        </label>
        <select
          id="theme-select"
          value={theme}
          onChange={(e) => setTheme(e.target.value as ThemeOption)}
        >
          <option value="default">Theme: Classic Metallic</option>
          <option value="theme-cyber">Theme: Cyber Polaroid</option>
          <option value="theme-darkroom">Theme: Vintage Darkroom</option>
        </select>
      </div>

      <div className="board-grid">
        {filteredPosts.map((item, index) => (
          <Card key={item.id || index} item={item} />
        ))}
      </div>

      {/* Circular Floating Action Button - Left (Help) */}
      <button
        className="fab-help"
        onClick={() => setIsHelpOpen(true)}
        aria-label="Open help guide"
      >
        ?
      </button>

      {/* Floating Action Button - Right (New Post) */}
      <button
        className="fab"
        onClick={() => setIsModalOpen(true)}
        aria-label="Create a new post"
      >
        +
      </button>

      <PostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={fetchPosts}
      />

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
};

export default App;