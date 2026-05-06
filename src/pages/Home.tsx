import { useNews } from '../context/NewsContext';
import { Calendar, User } from 'lucide-react';

const Home = () => {
  const { articles } = useNews();

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">Latest Updates</h1>
        <p className="section-subtitle">
          Stay informed with the latest tech news, insights, and stories from around the world.
        </p>
      </div>

      <div className="news-grid">
        {articles.length === 0 ? (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'var(--muted)' }}>
            No news articles available.
          </p>
        ) : (
          articles.map((article) => (
            <article key={article.id} className="card">
              <img src={article.imageUrl} alt={article.title} className="card-img" />
              <div className="card-content">
                <h3 className="card-title">{article.title}</h3>
                <p className="card-excerpt">{article.excerpt}</p>
                <div className="card-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={14} /> {article.author}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} /> {new Date(article.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
