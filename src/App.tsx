import React, { useEffect, useState, useCallback } from "react";
import { getDocs, query, orderBy, Timestamp, onSnapshot } from "firebase/firestore";
import { itemsCollection } from "./firebase";
import type { Post, SortOption } from "./types";
import { Card } from "./components/Card";
import { PostModal } from "./components/PostModal";

export const App: React.FC = () => {
  const [rawPosts, setRawPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortMode, setSortMode] = useState<SortOption>("newest");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPosts = useCallback(async () => {
    const q = query(itemsCollection, orderBy("timestamp", "desc"));
    try {
      const querySnapshot = await getDocs(q);
      const posts: Post[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Post, "id">)
      }));
      setRawPosts(posts);
    } catch (error) {
      console.error("Error loading posts from Firebase: ", error);
    }
  }, []);

  useEffect(() => {
    const q = query(itemsCollection, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const posts: Post[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Post, "id">)
      }));
      setRawPosts(posts);
    }, (error) => {
      console.error("Error loading posts from Firebase: ", error);
  });

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
        <select
          id="sort-select"
          value={sortMode}
          onChange={(e) => setSortMode(e.target.value as SortOption)}
        >
          <option value="newest">Sort by: Newest</option>
          <option value="oldest">Sort by: Oldest</option>
          <option value="title">Sort by: Name (A-Z)</option>
        </select>
      </div>

      <button 
        className="fab" 
        onClick={() => setIsModalOpen(true)}
        aria-label="Create a new post"
      >
        +
      </button>

      <div className="board-grid">
        {filteredPosts.map((item, index) => (
          <Card key={item.id || index} item={item} />
        ))}
      </div>

      <button className="fab" onClick={() => setIsModalOpen(true)}>
        +
      </button>

      <PostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={fetchPosts}
      />
    </>
  );
};

export default App;