import React, { useEffect, useState } from 'react';
import { 
  BookOpen, Search, Filter, Video, Clock, 
  ExternalLink, CheckCircle2, Sprout, ShieldAlert, 
  Sparkles, Layers 
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { knowledgeApi } from '../../services/api';
import { KnowledgeArticle } from '../../types';

export const KnowledgeCenterPage: React.FC = () => {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const res = await knowledgeApi.getArticles({ search: searchQuery, category: categoryFilter });
      if (res.data.success) {
        setArticles(res.data.articles);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [categoryFilter, searchQuery]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Krishi Knowledge Center & Agronomy Repository"
        subtitle="Scientific crop cultivation protocols, integrated pest management (IPM) guidelines, and soil health techniques"
        badge={<Badge variant="emerald">ICAR Certified Guidelines</Badge>}
      />

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides, pests, bio-fertilizers..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white font-semibold"
          >
            <option value="All">All Agricultural Categories</option>
            <option value="Pest Control">Pest Control (IPM)</option>
            <option value="Cultivation Practice">Cultivation Practice</option>
            <option value="Water Management">Water & Drip Irrigation</option>
            <option value="Soil Health">Soil Health & Nutrition</option>
            <option value="Post Harvest">Post-Harvest & Storage</option>
          </select>
        </div>
      </div>

      {/* Article Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.map(article => (
          <div
            key={article.id}
            className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs hover:border-emerald-400 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 overflow-hidden">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-900/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider">
                    {article.category}
                  </span>
                </div>
                {article.video_url && (
                  <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-semibold flex items-center gap-1">
                    <Video className="w-3 h-3 text-red-400" />
                    <span>Video Tutorial</span>
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 text-[11px] text-stone-400 mb-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{article.read_time_minutes} min read</span>
                  <span>•</span>
                  <span>{article.target_crop}</span>
                </div>

                <h3 className="font-bold text-base text-stone-900 dark:text-white leading-snug">
                  {article.title}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 line-clamp-2 leading-relaxed">
                  {article.summary}
                </p>

                <div className="mt-3 flex flex-wrap gap-1">
                  {article.tags?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 text-[10px]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                onClick={() => setSelectedArticle(article)}
                className="w-full py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 font-semibold text-xs border border-emerald-200 dark:border-emerald-800/60 transition-colors"
              >
                Read Complete Technical Guide
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Article Full Reader Modal */}
      {selectedArticle && (
        <Modal
          isOpen={!!selectedArticle}
          onClose={() => setSelectedArticle(null)}
          title={selectedArticle.title}
          subtitle={`Category: ${selectedArticle.category} • Author: ${selectedArticle.author} (${selectedArticle.published_date})`}
          maxWidth="3xl"
        >
          <div className="space-y-4 text-xs">
            <img
              src={selectedArticle.image_url}
              alt={selectedArticle.title}
              className="w-full h-56 rounded-xl object-cover border border-stone-200 dark:border-stone-800"
            />

            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 font-medium">
              💡 Summary: {selectedArticle.summary}
            </div>

            <div className="prose dark:prose-invert max-w-none text-stone-800 dark:text-stone-200 leading-relaxed space-y-3 whitespace-pre-line text-xs">
              {selectedArticle.content}
            </div>

            {selectedArticle.video_url && (
              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 dark:text-white block">Accompanying Demonstration Video</span>
                    <span className="text-stone-400 text-[11px]">Field procedure recorded by ICAR Extension Specialists</span>
                  </div>
                </div>
                <a
                  href={selectedArticle.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-red-600 text-white font-semibold flex items-center gap-1 hover:bg-red-700 transition-colors"
                >
                  <span>Watch</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
