
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api";

function App() {
  const [activeTab, setActiveTab] = useState("Home");
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [events] = useState([
    { title: "Tech Club Meetup", date: "Oct 15", category: "Technology" },
    { title: "Campus Photography Walk", date: "Oct 17", category: "Arts" },
    { title: "Group Study Session", date: "Oct 19", category: "Study" },
  ]);

  async function loadPosts() {
    try {
      setError("");
      const response = await fetch(`${API_URL}/posts`);

      if (!response.ok) {
        throw new Error("Unable to load posts");
      }

      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError("Could not load posts. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function addPost() {
    if (!postText.trim()) {
      setError("Please write something before publishing.");
      return;
    }

    try {
      setError("");

      const response = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: "You",
          content: postText.trim(),
          category: "General",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to publish post");
      }

      setPosts((currentPosts) => [data, ...currentPosts]);
      setPostText("");
      setActiveTab("Home");
    } catch (err) {
      setError(err.message || "Could not publish post.");
    }
  }

  async function likePost(id) {
    try {
      setError("");

      const response = await fetch(`${API_URL}/posts/${id}/like`, {
        method: "PATCH",
      });

      const updatedPost = await response.json();

      if (!response.ok) {
        throw new Error(updatedPost.message || "Unable to like post");
      }

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        )
      );
    } catch (err) {
      setError(err.message || "Could not like post.");
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <h2>CampusConnect</h2>
        <input type="text" placeholder="Search students, clubs, events..." />
        <div className="profile">P</div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <h3>Discover</h3>
          {["Home", "Clubs", "Events", "Study Groups", "My Profile"].map(
            (tab) => (
              <button
                key={tab}
                className={activeTab === tab ? "nav active" : "nav"}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            )
          )}
          <div className="sidebar-note">
            <h4>Find your community</h4>
            <p>Meet people, share interests, and learn together.</p>
          </div>
        </aside>

        <main className="content">
          <section className="welcome">
            <p>YOUR CAMPUS, YOUR COMMUNITY</p>
            <h1>Connect. Participate. Belong.</h1>
            <p>
              A friendly space to meet classmates, discover events, and study
              together.
            </p>
          </section>

          {activeTab === "Home" && (
            <>
              <section className="card composer">
                <h3>Share something with your campus</h3>
                <textarea
                  placeholder="Ask a question, share an idea, or start a conversation..."
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                />
                <button className="primary" onClick={addPost}>
                  Publish Post
                </button>
              </section>

              {error && <p role="alert">{error}</p>}

              <h2 className="section-title">Campus Community</h2>

              {loading ? (
                <p>Loading posts...</p>
              ) : posts.length === 0 ? (
                <p>No posts yet. Be the first to start a conversation!</p>
              ) : (
                posts.map((post) => (
                  <article className="card post" key={post._id}>
                    <div className="post-header">
                      <div className="avatar">
                        {(post.author || "S").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4>{post.author}</h4>
                        <p>{post.category || "General"}</p>
                      </div>
                    </div>
                    <p className="post-text">{post.content}</p>
                    <button
                      className="like-button"
                      onClick={() => likePost(post._id)}
                    >
                      ♡ Like ({post.likes || 0})
                    </button>
                  </article>
                ))
              )}
            </>
          )}

          {activeTab === "Clubs" && (
            <>
              <h2 className="section-title">Explore Clubs</h2>
              <div className="cards-grid">
                {[
                  ["💻", "Coding Club", "Programming and hackathons"],
                  ["📷", "Photography Club", "Capture campus life"],
                  ["🎭", "Arts Club", "Creativity, music, and drama"],
                ].map(([icon, title, description]) => (
                  <article className="card club-card" key={title}>
                    <span>{icon}</span>
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <button
                      className="primary"
                      onClick={() =>
                        alert("Club joining will be added in the next step.")
                      }
                    >
                      Explore Club
                    </button>
                  </article>
                ))}
              </div>
            </>
          )}

          {activeTab === "Events" && (
            <>
              <h2 className="section-title">Upcoming Events</h2>
              {events.map((event) => (
                <article className="card event" key={event.title}>
                  <div className="event-date">{event.date}</div>
                  <div>
                    <h3>{event.title}</h3>
                    <p>{event.category}</p>
                  </div>
                  <button
                    className="primary"
                    onClick={() =>
                      alert("Event registration will be added in the next step.")
                    }
                  >
                    View Event
                  </button>
                </article>
              ))}
            </>
          )}

          {activeTab === "Study Groups" && (
            <>
              <h2 className="section-title">Study Together</h2>
              <article className="card">
                <h3>Data Structures and Algorithms</h3>
                <p>Practice coding problems with other students.</p>
                <p>Looking for teammates: 3–5 students</p>
                <button
                  className="primary"
                  onClick={() =>
                    alert("Study group joining will be added in the next step.")
                  }
                >
                  Find Group
                </button>
              </article>
              <article className="card">
                <h3>Cloud Computing Study Circle</h3>
                <p>Discuss cloud concepts and prepare for lab exams.</p>
                <button
                  className="primary"
                  onClick={() =>
                    alert("Study group joining will be added in the next step.")
                  }
                >
                  Find Group
                </button>
              </article>
            </>
          )}

          {activeTab === "My Profile" && (
            <article className="card profile-card">
              <div className="large-avatar">P</div>
              <h2>Your Student Profile</h2>
              <p>Welcome to CampusConnect!</p>
              <p>Connect with classmates and discover your interests.</p>
            </article>
          )}
        </main>

        <aside className="rightbar">
          <section className="card">
            <h3>Upcoming Events</h3>
            {events.slice(0, 3).map((event) => (
              <div className="mini-event" key={event.title}>
                <div className="small-date">{event.date}</div>
                <div>
                  <strong>{event.title}</strong>
                  <p>{event.category}</p>
                </div>
              </div>
            ))}
            <button
              className="text-button"
              onClick={() => setActiveTab("Events")}
            >
              See all events →
            </button>
          </section>

          <section className="card encouragement">
            <h3>Everyone belongs here 💜</h3>
            <p>
              Start small. Join a study group, attend an event, or say hello
              to someone new.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default App;
